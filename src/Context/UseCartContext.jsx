import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./UseAuthContext";
import { ToastContext } from "./UseToastContext";
import { useNavigate } from "react-router-dom";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
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
      setError(null);

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
      const cartData = (data.cart || []).map((item) => {
        // Check multiple possible field names for cart ID
        const cartId =
          item.cart_id || item.id || item.cartId || item.cart_item_id;

        return {
          ...item,
          cart_id: cartId, // ✅ Use whatever field exists
          selectedSize:
            item.selectedSize || item.size || item.product_size || null,
          product_name: item.product_name || item.name || "Unknown",
          price: parseFloat(item.price) || 0,
          quantity: parseInt(item.quantity) || 1,
        };
      });

      setCart(cartData);
      localStorage.setItem("cart", JSON.stringify(cartData));
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError(error.message);

      // Fallback to localStorage
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCart(parsedCart);

          if (parsedCart.length === 0) {
            setError(error.message);
          } else {
            console.warn("Using local cart data due to sync error");
          }
        } catch (parseError) {
          console.error("❌ Error parsing localStorage:", parseError);
          setCart([]);
          setError(error.message);
        }
      } else {
        setCart([]);
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      const saved = localStorage.getItem("cart");
      setCart(saved ? JSON.parse(saved) : []);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const requireAuth = (actionName = "add to cart") => {
    if (!isAuthenticated) {
      showToast(`Please Sign in to ${actionName}`, "Warning");
      return false;
    }
    return true;
  };

  const addToCart = async (product) => {
    if (!requireAuth("add to cart")) {
      setTimeout(() => {
        navigate("/signin");
      }, 1500);
      return false;
    }

    const token = getToken();

    if (!token) {
      showToast("Please Sign in to Add to cart");
      navigate("/");
      return;
    }

    if (!product.stock_quantity || product.stock_quantity === 0) {
      showToast("❌ Product is out of stock!", "error");
      return;
    }

    const selectedSize = product.selectedSize || product.size || null;

    const existingItem = cart.find(
      (item) =>
        item.product_id === product.product_id &&
        item.selectedSize === selectedSize
    );

    // ✅ Check if adding will exceed stock
    if (existingItem) {
      const newQuantity = existingItem.quantity + 1;
      if (newQuantity > product.stock_quantity) {
        showToast(
          `⚠️ Only ${product.stock_quantity} items available in stock!`,
          "error"
        );
        return;
      }
    }

    // ✅ IMMEDIATE UI UPDATE (Optimistic)
 setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) =>
          item.product_id === product.product_id &&
          item.selectedSize === selectedSize
      );

      let updatedCart;
      if (existingItem) {
        // ✅ Double-check stock before updating
        if (existingItem.quantity + 1 > product.stock_quantity) {
          return prevCart; // Don't update if exceeds stock
        }

        updatedCart = prevCart.map((item) =>
          item.product_id === product.product_id &&
          (item.selectedSize || item.size) === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [
          ...prevCart,
          {
            ...product,
            quantity: 1,
            selectedSize: selectedSize,
            size: selectedSize,
            stock_quantity: product.stock_quantity, // ✅ Store stock info
          },
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
              (item.selectedSize || item.size) !== selectedSize
          );
          localStorage.setItem("cart", JSON.stringify(rollbackCart));
          return rollbackCart;
        });

        setError(error.message);
      }
    }
  };

  const removeFromCart = async (cartItem) => {
    const token = getToken();

    const { product_id, selectedSize, size, cart_id, product_size } = cartItem;

    const itemSize = selectedSize || size || product_size || null;

    // ✅ IMMEDIATE UI UPDATE
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => {
        // Match by both product_id AND selectedSize

        if (cart_id && item.cart_id) {
          return item.cart_id !== cart_id;
        }

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
        showToast("Removed from cart", "success");
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

  const updateCartItemQuantity = async (cartItem, amount) => {
    const token = getToken();
    const { product_id, selectedSize } = cartItem;

    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) => {
          if (
            item.product_id === product_id &&
            item.selectedSize === selectedSize
          ) {
            const newQuantity = item.quantity + amount;

            if (newQuantity <= 0) {
              return null;
            }

            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(Boolean); 

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });

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

        await fetchCart();
      } catch (error) {
        console.error("Error updating cart:", error);
      }
    }
  };

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
        loading, 
        error,
        fetchCart,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
