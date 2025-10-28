import React, { createContext, useState, useEffect } from "react";

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState(() => {
    // Initial load from localStorage
    const storedReviews = localStorage.getItem("productReviews");
    return storedReviews ? JSON.parse(storedReviews) : [];
  });

  // Save to localStorage whenever reviews change
  useEffect(() => {
    localStorage.setItem("productReviews", JSON.stringify(reviews));
  }, [reviews]);

  const addReview = (productId, review) => {
    const newReview = {
      id: Date.now(),
      productId: parseInt(productId),
      ...review,
      date: new Date().toISOString(),
      verified: true,
    };
    setReviews((prevReviews) => {
      const updated = [...prevReviews, newReview];
      return updated;
    });
  };

  const getProductReviews = (productId) => {
    const pid = parseInt(productId);
    const filtered = reviews.filter((review) => review.productId === pid);
    return filtered;
  };

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        addReview,
        getProductReviews,
        totalReviews: reviews.length, // Add this for debugging
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};
