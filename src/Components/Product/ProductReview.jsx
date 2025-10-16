// Review.jsx
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

function ProductReview() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !message || !rating) return;
    // Backend/API ku anuppa ready payload
    const payload = { name, message, rating: Number(rating) };
    console.log("Review submitted:", payload);
    alert("Thanks for your review!");
    setName("");
    setMessage("");
    setRating("");
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 py-16 px-4 mt-16">
      {/* Top-left Icon -> Product Detail */}
      <Link
        to={'/product'}
        aria-label="Go to product"
        title="Go to Product"
        className="group absolute top-[150px] left-[100px] z-20 inline-flex items-center justify-center rounded-full border border-neutral-700 bg-neutral-900/70 p-2 text-gray-300 hover:text-white hover:border-gray-500 focus:outline-none backdrop-blur"
      >
        {/* Package/Box icon (SVG) */}
        <FaArrowLeft className="transition-transform group-hover:-translate-y-0.5 text-white text-[20px]" />
      </Link>
      <h1 className="text-center text-4xl md:text-[30px] font-semibold tracking-wide py-5">
        RATINGS & REVIEWS
      </h1>

      <div className="mx-auto max-w-[600px] border border-neutral-800 bg-black/60 shadow-lg">
        <form
          onSubmit={handleSubmit}
          className="px-4 py-4 space-y-3 font-['Poppins'] font-[400]"
        >
          {/* Name */}
          <div>
            <label className="block text-[12px] text-gray-400 mb-2">Name</label>
            <input
              type="text"
              placeholder="Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full text-[13px] rounded-[12px] bg-neutral-900 px-4 py-3 text-gray-100 placeholder:text-gray-400 outline-none"
            />
          </div>

          {/* Review */}
          <div>
            <label className="block text-[12px] text-gray-400 mb-2">
              Write a review
            </label>
            <textarea
              rows={6}
              placeholder="Review Description"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full text-[13px] resize-y rounded-[12px] bg-neutral-900 px-4 py-3 text-gray-100 placeholder:text-gray-400 outline-none"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-[12px] text-gray-400 mb-2">
              Rating
            </label>
            <div className="relative">
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                required
                className="w-full text-[13px] appearance-none rounded-[12px] bg-neutral-900 px-4 py-3 pr-10 text-gray-100 outline-none"
              >
                <option value="" disabled>
                  Select...
                </option>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </select>
              {/* dropdown chevron */}
              <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 111.04 1.08l-4.24 3.36a.75.75 0 01-.94 0L5.21 8.31a.75.75 0 01.02-1.1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full text-[13px] rounded-[12px] bg-[#8f673f] py-3 font-semibold tracking-wide text-white hover:bg-[#815a37] focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          >
            SUBMIT
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProductReview;
