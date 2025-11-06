import React, { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true); // Only for initial load
  const [error, setError] = useState(null);

  // Backend API base URL
  const BACKEND_URL = import.meta.env.VITE_API_URL;

  // ✅ Get token dynamically (not static)
  const getToken = () => localStorage.getItem("token");

  // ✅ Fetch cart data from backend (Initial load only)
  const fetchCart = async () => {
    const token = getToken();

    try {
      setLoading(true);

      if (!token) {
        // No token, load from localStorage
        const savedCart = localStorage.getItem("cart");
        setCart(savedCart ? JSON.parse(savedCart) : []);
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

  // ✅ Fetch cart when component mounts
  useEffect(() => {
    fetchCart();
  }, []); // Only run once

  // ✅ 1. Add to Cart - OPTIMISTIC UPDATE (UI first, backend second)
  const addToCart = async (product) => {
    const token = getToken();

    // ✅ IMMEDIATE UI UPDATE (Optimistic)
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product_id === product.product_id
      );

      let updatedCart;
      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...prevCart, { ...product, quantity: 1 }];
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
            price: product.price,
            name: product.name,
            image: product.image,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // ✅ Update with backend response if different
        if (data.cart) {
          setCart(data.cart);
          localStorage.setItem("cart", JSON.stringify(data.cart));
        }
      } catch (error) {
        console.error("Error syncing cart with backend:", error);
        // UI already updated, so no rollback needed
      }
    }
  };

  // ✅ 2. Remove from Cart - OPTIMISTIC UPDATE
  const removeFromCart = async (itemId) => {
    const token = getToken();

    // ✅ IMMEDIATE UI UPDATE
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.product_id !== itemId);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });

    // ✅ Sync with backend
    if (token) {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/cart/remove/${itemId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.error("Failed to remove from backend");
        }
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  // ✅ 3. Update Cart Item Quantity - OPTIMISTIC UPDATE
  const updateCartItemQuantity = async (id, amount) => {
    const token = getToken();

    // ✅ IMMEDIATE UI UPDATE
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) => {
          if (item.product_id === id) {
            const newQuantity = item.quantity + amount;

            // Remove if quantity <= 0
            if (newQuantity <= 0) {
              removeFromCart(id); // This will handle backend deletion
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
        const currentItem = cart.find((item) => item.product_id === id);
        if (!currentItem) return;

        const newQuantity = currentItem.quantity + amount;

        if (newQuantity <= 0) {
          return; // Already handled by removeFromCart above
        }

        const response = await fetch(`${BACKEND_URL}/api/cart/update`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: id,
            quantity: newQuantity,
          }),
        });

        if (!response.ok) {
          console.error("Failed to update backend");
        }
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

  // ✅ 5. Sync cart with backend
  const syncCart = async () => {
    const token = getToken();

    try {
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

      if (localCart.length > 0 && token) {
        const response = await fetch(`${BACKEND_URL}/api/cart/sync`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cart: localCart }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.cart) {
          setCart(data.cart);
          localStorage.setItem("cart", JSON.stringify(data.cart));
        }
      }
    } catch (error) {
      console.error("Error syncing cart:", error);
    }
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
        syncCart,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
