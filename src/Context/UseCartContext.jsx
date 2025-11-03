import React, { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Backend API base URL
  const BACKEND_URL = import.meta.env.VITE_API_URL;

  // Get token for authentication if exists
  const token = localStorage.getItem("token"); // or your auth token

  // Fetch cart data from backend
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/cart`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCart(data.cart || []);

      // Save to localStorage for offline support
      localStorage.setItem("cart", JSON.stringify(data.cart || []));
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError(error.message);

      // If backend fails, load from localStorage
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart when component mounts
  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      // If no token, load from localStorage
      const savedCart = localStorage.getItem("cart");
      setCart(savedCart ? JSON.parse(savedCart) : []);
    }
  }, [token]);

  // 1. Add to Cart - Backend API call
  const addToCart = async (product) => {
    try {
      setLoading(true);

      // Backend API call
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
          // Add other fields as needed
        }),
      });

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle success response
      if (data.success) {
        // If updated cart comes from backend
        if (data.cart) {
          setCart(data.cart);
          localStorage.setItem("cart", JSON.stringify(data.cart));
        } else {
          // Or update local state
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
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setError(error.message);

      // If backend fails, add locally as fallback
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
    } finally {
      setLoading(false);
    }
  };

  // 2. Remove from Cart - Backend API call
  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);

      const response = await fetch(`${BACKEND_URL}/api/cart/remove/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const updatedCart = cart.filter((item) => item.product_id !== itemId);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      setError(error.message);

      // Local remove as fallback
      const updatedCart = cart.filter((item) => item.product_id !== itemId);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } finally {
      setLoading(false);
    }
  };

  // 3. Update Cart Item Quantity - Backend API call
  const updateCartItemQuantity = async (id, amount) => {
    try {
      setLoading(true);

      const currentItem = cart.find((item) => item.product_id === id);
      if (!currentItem) return;

      const newQuantity = currentItem.quantity + amount;

      if (newQuantity <= 0) {
        // If quantity is 0 or less, remove the item
        await removeFromCart(id);
        return;
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const updatedCart = cart.map((item) =>
          item.product_id === id ? { ...item, quantity: newQuantity } : item
        );
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      setError(error.message);

      // Local update as fallback
      const updatedCart = cart
        .map((item) =>
          item.product_id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } finally {
      setLoading(false);
    }
  };

  // 4. Clear entire cart
  const clearCart = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${BACKEND_URL}/api/cart/clear`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setCart([]);
        localStorage.removeItem("cart");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      setError(error.message);

      // Clear locally as fallback
      setCart([]);
      localStorage.removeItem("cart");
    } finally {
      setLoading(false);
    }
  };

  // 5. Sync cart with backend (optional)
  const syncCart = async () => {
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

        if (data.success) {
          setCart(data.cart);
          localStorage.setItem("cart", JSON.stringify(data.cart));
        }
      }
    } catch (error) {
      console.error("Error syncing cart:", error);
    }
  };

  // Sync cart when user logs in
  useEffect(() => {
    if (token) {
      syncCart();
    }
  }, [token]);

  // Calculate values
  const getCartItems = () => cart;

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartLength = cart.length;

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
        syncCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
