import { createContext, useEffect, useState } from "react";

export const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Backend API base URL
  const BACKEND_URL = import.meta.env.VITE_API_URL;

  // Get token for authentication if exists
  const token = localStorage.getItem("token");

  // Fetch wishlist data from backend
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/wishlist`, {
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
      setWishlist(data.wishlist || []);

      console.log(data.wishlist);

      // Save to localStorage for offline support
      localStorage.setItem("wishlist", JSON.stringify(data.wishlist || []));
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setError(error.message);

      // If backend fails, load from localStorage
      const saved = localStorage.getItem("wishlist");
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch wishlist when component mounts
  useEffect(() => {
    if (token) {
      fetchWishlist();
    } else {
      // If no token, load from localStorage
      const saved = localStorage.getItem("wishlist");
      setWishlist(saved ? JSON.parse(saved) : []);
    }
  }, [token]);

  // 1. Add to Wishlist - Backend API call
  const addToWishlist = async (product) => {
    try {
      setLoading(true);

      // Backend API call
      const response = await fetch(`${BACKEND_URL}/api/wishlist/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: product.product_id,
          name: product.name,
          price: product.price,
          image: product.image,
          // Add other fields as needed
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle success response
      if (data.success) {
        // If updated wishlist comes from backend
        if (data.wishlist) {
          console.log("add wishlist", data.wishlist);
          setWishlist(data.wishlist);
          localStorage.setItem("wishlist", JSON.stringify(data.wishlist));
        } else {
          // Or update local state
          setWishlist((prev) => {
            const exists = prev.find(
              (item) => item.product_id === product.product_id
            );
            if (exists) return prev; // Avoid duplicates

            const updatedWishlist = [...prev, product];
            localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
            return updatedWishlist;
          });
        }
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      setError(error.message);

      // If backend fails, add locally as fallback
      setWishlist((prev) => {
        const exists = prev.find(
          (item) => item.product_id === product.product_id
        );
        if (exists) return prev;

        const updatedWishlist = [...prev, product];
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        return updatedWishlist;
      });
    } finally {
      setLoading(false);
    }
  };

  // 2. Remove from Wishlist - Backend API call
  const removeFromWishlist = async (id) => {
    try {
      setLoading(true);

      const response = await fetch(`${BACKEND_URL}/api/wishlist/remove/${id}`, {
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
        const updatedWishlist = wishlist.filter(
          (item) => item.product_id !== id
        );
        setWishlist(updatedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      setError(error.message);

      // Local remove as fallback
      const updatedWishlist = wishlist.filter((item) => item.product_id !== id);
      setWishlist(updatedWishlist);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    } finally {
      setLoading(false);
    }
  };

  // 5. Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.product_id === productId);
  };

  // 6. Sync wishlist with backend (optional)
  const syncWishlist = async () => {
    try {
      const localWishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );

      if (localWishlist.length > 0 && token) {
        const response = await fetch(`${BACKEND_URL}/api/wishlist/sync`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ wishlist: localWishlist }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setWishlist(data.wishlist);
          localStorage.setItem("wishlist", JSON.stringify(data.wishlist));
        }
      }
    } catch (error) {
      console.error("Error syncing wishlist:", error);
    }
  };

  // Sync wishlist when user logs in
  useEffect(() => {
    if (token) {
      syncWishlist();
    }
  }, [token]);

  // Get wishlist count
  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount,
        loading,
        error,
        fetchWishlist,
        syncWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
