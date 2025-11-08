import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./UseAuthContext";
import { ToastContext } from "./UseToastContext";
import { useNavigate } from "react-router-dom";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => {
    if (isAuthenticated) {
      const saveCart = localStorage.getItem("cart");
      return saveCart ? JSON.parse(saveCart) : [];
    }
    return [];
  });
  const { showToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_API_URL;

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const token = getToken();

    try {
      setLoading(true);

      if (!token) {
        const saved = localStorage.getItem("cart");
        setCart(saved ? JSON.parse(saved) : []);
        return;
      }

      const response = await fetch(`${BACKEND_URL}/api/cart`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const cartData = data.cart || [];

      setCart(cartData);
      localStorage.setItem("cart", JSON.stringify(cartData));
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError(error.message);

      // Fallback to localStorage
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }else{
      const saved = localStorage.getItem("cart")
      setCart(saved ? JSON.parse(saved) : [])
      setLoading(false)
    }
  }, [isAuthenticated]);

  const requireAuth = (actionName = "add to cart") => {
    if (!isAuthenticated) {
      showToast(`Please Sign in to ${actionName}`, "Warning");
      return false;
    }
    return true;
  };

  // ✅ 1. Add to Cart - OPTIMISTIC UPDATE (UI first, backend second)
  const addToCart = async (product) => {
    if (!requireAuth("add to cart")) {
      setTimeout(() => {
        navigate("/signin");
      }, 1500);
      return false;
    }

    const token = getToken();

    if(!token){
      showToast("Please Sign in to Add to cart")
      navigate("/")
      return
    }

    // ✅ Extract selected size
    const selectedSize = product.selectedSize || null;

    // ✅ IMMEDIATE UI UPDATE (Optimistic)
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) =>
          item.product_id === product.product_id &&
          item.selectedSize === selectedSize
      );

      let updatedCart;
      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          item.product_id === product.product_id &&
          item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [
          ...prevCart,
          { ...product, quantity: 1, selectedSize: selectedSize },
        ];
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });

    // ✅ THEN sync with backend in background
    if (token) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/cart/add`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: product.product_id,
            quantity: 1,
            size: selectedSize,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        await fetchCart();
      } catch (error) {
        console.error("Error syncing cart with backend:", error);
        // ✅ STEP 4: ROLLBACK on error (remove optimistic update)
        setCart((prevCart) => {
          const rollbackCart = prevCart.filter(
            (item) =>
              item.product_id !== product.product_id &&
              item.selectedSize !== selectedSize
          );
          localStorage.setItem("cart", JSON.stringify(rollbackCart));
          return rollbackCart;
        });

        setError(error.message);
      }
    }
  };

  // ✅ 2. Remove from Cart - OPTIMISTIC UPDATE
  const removeFromCart = async (cartItem) => {
    const token = getToken();

    const { product_id, selectedSize } = cartItem;

    // ✅ IMMEDIATE UI UPDATE
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => {
        // Match by both product_id AND selectedSize
        return !(
          item.product_id === product_id && item.selectedSize === selectedSize
        );
      });

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });

    // ✅ Sync with backend
    if (token) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/cart/remove`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: product_id,
            size: selectedSize,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to remove from backend");
        }

        // ✅ Re-fetch to confirm
        await fetchCart();
      } catch (error) {
        console.error("Error removing from cart:", error);

        // ✅ Rollback on error
        setCart((prevCart) => {
          const rollbackCart = [...prevCart, cartItem];
          localStorage.setItem("cart", JSON.stringify(rollbackCart));
          return rollbackCart;
        });
      }
    }
  };

  // ✅ 3. Update Cart Item Quantity - OPTIMISTIC UPDATE
  const updateCartItemQuantity = async (cartItem, amount) => {
    const token = getToken();
    const { product_id, selectedSize } = cartItem;

    // ✅ IMMEDIATE UI UPDATE - Match by product_id AND size
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) => {
          // Match specific item (product_id + size)
          if (
            item.product_id === product_id &&
            item.selectedSize === selectedSize
          ) {
            const newQuantity = item.quantity + amount;

            // Remove if quantity <= 0
            if (newQuantity <= 0) {
              return null;
            }

            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(Boolean); // Remove null items

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });

    // ✅ Sync with backend
    if (token) {
      try {
        const currentItem = cart.find(
          (item) =>
            item.product_id === product_id && item.selectedSize === selectedSize
        );

        if (!currentItem) return;

        const newQuantity = currentItem.quantity + amount;

        // If quantity becomes 0, remove the item
        if (newQuantity <= 0) {
          await removeFromCart(cartItem);
          return;
        }

        const response = await fetch(`${BACKEND_URL}/api/cart/update`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: product_id,
            size: selectedSize,
            quantity: newQuantity,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update backend");
        }

        // Re-fetch to confirm
        await fetchCart();
      } catch (error) {
        console.error("Error updating cart:", error);
      }
    }
  };

  // ✅ 4. Clear entire cart - OPTIMISTIC UPDATE
  const clearCart = async () => {
    const token = getToken();

    // ✅ IMMEDIATE UI UPDATE
    setCart([]);
    localStorage.removeItem("cart");

    // ✅ Sync with backend
    if (token) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/cart/clear`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("Failed to clear cart on backend");
        }
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    }
  };

  // ✅ NEW: Change Cart Item Size
  const changeCartItemSize = (productId, oldSize, newSize) => {
    setCart((prevCart) => {
      // Check if new size already exists
      const existingNewSizeIndex = prevCart.findIndex(
        (item) => item.product_id === productId && item.selectedSize === newSize
      );

      const oldSizeIndex = prevCart.findIndex(
        (item) => item.product_id === productId && item.selectedSize === oldSize
      );

      if (oldSizeIndex === -1) return prevCart;

      const updatedCart = [...prevCart];

      if (existingNewSizeIndex > -1) {
        // New size already exists - merge quantities
        updatedCart[existingNewSizeIndex].quantity +=
          updatedCart[oldSizeIndex].quantity;
        // Remove old size item
        updatedCart.splice(oldSizeIndex, 1);
      } else {
        // Just update the size
        updatedCart[oldSizeIndex] = {
          ...updatedCart[oldSizeIndex],
          selectedSize: newSize,
        };
      }

      return updatedCart;
    });
  };

  // ✅ Calculate values (memoized for performance)
  const getCartItems = () => cart;

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const cartLength = cart.length;

  // ✅ Check if item is in cart
  const isInCart = (productId) => {
    return cart.some((item) => item.product_id === productId);
  };

  // ✅ Get item quantity
  const getItemQuantity = (productId) => {
    const item = cart.find((item) => item.product_id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        getCartItems,
        clearCart,
        totalPrice,
        totalItems,
        cartLength,
        loading, // Only true during initial load
        error,
        fetchCart,
        isInCart,
        changeCartItemSize,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
