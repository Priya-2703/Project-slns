// components/ProductReview/ProductReviewForm.jsx
import React, { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ReviewContext } from "../../Context/UseReviewContext";
import { ToastContext } from "../../Context/UseToastContext";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProductReviewForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addReview, totalReviews } = useContext(ReviewContext);
  const { showToast } = useContext(ToastContext);

  const [formData, setFormData] = useState({
    name: "",
    rating: 0,
    review: "",
    quality: "",
  });

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleQualitySelect = (quality) => {
    setFormData({ ...formData, quality });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.rating || !formData.review) {
      showToast("Please fill all required fields", "error");
      return;
    }

    // Add review
    addReview(id, formData);
    showToast("Review submitted successfully!", "success");

    // Navigate back to product page
    navigate(`/product/${id}`, {
      state: {
        showCelebration: true,
      },
    });
  };

  return (
    <div className="w-full bg-black min-h-screen pt-28 pb-20">
      <Link
        to={`/product/${id}`}
        className="group absolute top-[90px] left-[30px] lg:top-[150px] lg:left-[50px] z-20 inline-flex items-center justify-center rounded-full border border-neutral-700 bg-black p-2 text-gray-300 hover:text-white hover:border-gray-500 focus:outline-none backdrop-blur"
      >
        <FaArrowLeft className="transition-transform group-hover:-translate-y-0.5 text-white text-[10px] md:text-[18px]" />
      </Link>

      <div className="w-[90%] lg:w-[60%] mx-auto">
        <h1 className="text-white font-heading text-[32px] md:text-[48px] font-[950] mb-8">
          Write a Review
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label className="text-white font-body text-[14px] mb-2 block">
              Your Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-body focus:outline-none focus:border-white/50"
              placeholder="Enter your name"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="text-white font-body text-[14px] mb-2 block">
              Rating *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className={`text-[30px] ${
                    star <= formData.rating
                      ? "text-yellow-500"
                      : "text-gray-500"
                  } hover:text-yellow-400 transition-colors`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="text-white font-body text-[14px] mb-2 block">
              Your Review *
            </label>
            <textarea
              value={formData.review}
              onChange={(e) =>
                setFormData({ ...formData, review: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-body focus:outline-none focus:border-white/50 h-32 resize-none"
              placeholder="Write your review here..."
            />
          </div>

          {/* Quality Selection */}
          <div>
            <label className="text-white font-body text-[14px] mb-2 block">
              Product Quality
            </label>
            <div className="flex gap-4">
              {["Poor", "Good", "Awesome"].map((quality) => (
                <button
                  key={quality}
                  type="button"
                  onClick={() => handleQualitySelect(quality)}
                  className={`text-white text-[12px] md:text-[14px] font-['Poppins'] border-b-2 px-4 py-2 ${
                    formData.quality === quality
                      ? "border-b-white bg-white/10"
                      : "border-b-white/20"
                  } hover:border-b-white/50 transition-all`}
                >
                  {quality}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              className="flex-1 py-3 bg-accet text-white font-body text-[16px] rounded-lg hover:bg-accet/80 transition-colors"
            >
              Submit Review
            </button>
            <button
              type="button"
              onClick={() => navigate(`/product/${id}`)}
              className="flex-1 py-3 bg-white/10 text-white font-body text-[16px] rounded-lg hover:bg-white/20 transition-colors border border-white/20"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductReviewForm;
