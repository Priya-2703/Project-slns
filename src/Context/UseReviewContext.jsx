import React, { createContext, useState, useCallback, useEffect } from "react";

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const BACKEND_URL = import.meta.env.VITE_API_URL;

  const [reviews, setReviews] = useState(() => {
    // ✅ Load from localStorage on init
    try {
      const stored = localStorage.getItem("productReviews");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading reviews from localStorage:", error);
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch all reviews for a specific product
  const fetchProductReviews = useCallback(
    async (productId) => {
      if (!productId) return [];

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${BACKEND_URL}/api/products/${productId}/reviews`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const productReviews = Array.isArray(data.reviews) ? data.reviews : [];

        setReviews((prevReviews) => {
          // Remove old reviews for this product
          const filtered = prevReviews.filter(
            (r) => r.productId !== parseInt(productId)
          );
          // Add new reviews
          const updated = [...filtered, ...productReviews];

          // ✅ Save to localStorage
          localStorage.setItem("productReviews", JSON.stringify(updated));

          return updated;
        });

        return productReviews;
      } catch (error) {
        console.error("❌ Error fetching reviews:", error);
        setError(error.message);

        // ✅ Fallback to localStorage
        const storedReviews = localStorage.getItem("productReviews");
        if (storedReviews) {
          try {
            const allReviews = JSON.parse(storedReviews);
            const productReviews = allReviews.filter(
              (r) => r.productId === parseInt(productId)
            );
            return productReviews;
          } catch (e) {
            console.error("Error parsing stored reviews:", e);
            return [];
          }
        }

        return [];
      } finally {
        setLoading(false);
      }
    },
    [BACKEND_URL]
  );

  // ✅ Add a new review
  const addReview = async (productId, reviewData) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${BACKEND_URL}/api/products/${productId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            name: reviewData.name,
            rating: reviewData.rating,
            review: reviewData.review,
            quality: reviewData.quality || null,
            email: reviewData.email || null,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit review");
      }

      const data = await response.json();

      // ✅ Re-fetch to get updated reviews from backend
      const updatedReviews = await fetchProductReviews(productId);

      return { success: true, reviews: updatedReviews };
    } catch (error) {
      console.error("❌ Error adding review:", error);
      setError(error.message);

      // ✅ Fallback: Add to localStorage only
      const newReview = {
        id: Date.now(),
        productId: parseInt(productId),
        ...reviewData,
        date: new Date().toISOString(),
        verified: false, // Not verified if backend failed
      };

      setReviews((prevReviews) => {
        const updated = [...prevReviews, newReview];
        localStorage.setItem("productReviews", JSON.stringify(updated));
        return updated;
      });

      return { success: false, error: error.message, review: newReview };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get reviews for a specific product (from local state)
  const getProductReviews = useCallback(
    (productId) => {
      if (!productId) return [];
      const pid = parseInt(productId);
      const filtered = reviews.filter((review) => review.productId === pid);
      console.log(`📋 Getting reviews for product ${pid}:`, filtered); // Debug log
      return filtered;
    },
    [reviews]
  );


  // ✅ Get total review count for a product
  const getProductReviewCount = useCallback(
    (productId) => {
      return getProductReviews(productId).length;
    },
    [getProductReviews]
  );

  // ✅ Get average rating for a product
  const getProductAverageRating = useCallback(
    (productId) => {
      const productReviews = getProductReviews(productId);
      if (productReviews.length === 0) return 0;

      const totalRating = productReviews.reduce(
        (sum, review) => sum + (review.rating || 0),
        0
      );
      return (totalRating / productReviews.length).toFixed(1);
    },
    [getProductReviews]
  );

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        addReview,
        getProductReviews,
        fetchProductReviews,
        getProductReviewCount,
        getProductAverageRating,
        loading,
        error,
        totalReviews: reviews.length,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};
