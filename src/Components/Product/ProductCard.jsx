import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoHeart } from "react-icons/go";
import { Link } from "react-router-dom";
import { WishlistContext } from "../../Context/UseWishListContext";
import { IoHeartSharp } from "react-icons/io5";
import { ToastContext } from "../../Context/UseToastContext";

const ProductCard = ({ product }) => {
  const { wishlist, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);
  const { showToast } = useContext(ToastContext);

  // ✅ Hover state for video
  const [isHovered, setIsHovered] = useState(false);

  const isInWishlist = wishlist.some(
    (item) => item.product_id === product.product_id
  );

  const handleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(product.product_id);
      showToast("Item removed in Wishlist", "success");
    } else {
      addToWishlist(product);
      showToast("Item added in Wishlist", "success");
    }
  };


  // bubbles
  const bubbles = Array.from({ length: 6 });

  return (
    <>
      <Link
        to={`/product/${product.product_id}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="lg:w-[250px] w-40 min-h-[330px] md:w-[200px] md:min-h-[430px] lg:min-h-[550px] relative flex flex-col gap-2 lg:gap-4 cursor-pointer group"
      >
        <button
          onClick={(e) => {
            e.preventDefault(); // stop <Link> navigation
            e.stopPropagation(); // stop event bubbling
            handleWishlist();
          }}
          className="absolute top-2 right-2 lg:top-3 lg:right-3 z-20 rounded-[4px] lg:w-9 lg:h-9 md:w-7 md:h-7 w-6 h-6 bg-slate-800 flex justify-center items-center"
        >
          <AnimatePresence>
            {isInWishlist && (
              <motion.div
                key="bubbles"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 flex justify-center items-center"
              >
                {bubbles.map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute w-2 h-2 bg-pink-500 rounded-full"
                    initial={{
                      scale: 0,
                      x: 0,
                      y: 0,
                      opacity: 1,
                    }}
                    animate={{
                      scale: [1, 1.2, 0],
                      x: Math.cos((i / bubbles.length) * 2 * Math.PI) * 20,
                      y: Math.sin((i / bubbles.length) * 2 * Math.PI) * 20,
                      opacity: [1, 0],
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            key={isInWishlist}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.6, 1] }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {isInWishlist ? (
              <IoHeartSharp className="text-[16px] lg:text-[19px] text-pink-600" />
            ) : (
              <GoHeart className="text-[15px] lg:text-[18px] text-white" />
            )}
          </motion.div>
        </button>
        {/* ✅ Image/Video Container */}
        <div className="relative overflow-hidden rounded-xl">
          {/* ✅ Image - Always visible */}
          <img
            src={product.image_url}
            alt={product.product_name}
            className={`w-full h-[250px] md:h-[300px] lg:h-[400px] object-cover transition-all duration-500 ${
              isHovered && product.video_url
                ? "opacity-0 scale-110"
                : "opacity-100 group-hover:scale-110"
            }`}
          />

          {/* ✅ Video - Shows on hover if exists */}
          {product.video_url && (
            <video
              src={product.video_url}
              className={`absolute inset-0 w-full h-[250px] md:h-[300px] lg:h-[400px] object-cover transition-all duration-500 ${
                isHovered
                  ? "opacity-100 scale-110"
                  : "opacity-0 scale-100 pointer-events-none"
              }`}
              autoPlay={isHovered}
              loop
              muted
              playsInline
            />
          )}
        </div>

        <div className="flex justify-between items-start text-white">
          <div className="flex flex-col justify-center items-start gap-2 lg:gap-2">
            <h1 className="w-[90%] text-[12px] md:text-[14px] lg:text-[17px] font-body font-[600] capitalize lg:leading-6 line-clamp-2">
              {product.product_name}
            </h1>
            <p className="font-body text-[12px] md:text-[14px] lg:text-[16px] leading-none">
              ₹{parseInt(product.price)}
            </p>
          </div>
          <div className="flex flex-col justify-center items-start gap-2 md:gap-3">
            <p className="px-2 py-1 border-2 border-white text-[12px] md:text-[14px] lg:text-[16px] font-body">
              {parseInt(product.discount)}%
            </p>
            <p className="text-gray-500 line-through font-body text-[12px] md:text-[14px] lg:text-[16px]">
              ₹{parseInt(product.actual_price)}
            </p>
          </div>
        </div>
        <div className="flex justify-start pt-1 lg:pt-0">
          <p className="text-white/65 tracking-wide font-body capitalize text-[8px] md:text-[9px] lg:text-[10px] leading-0">
            {product.product_id + 2} styling Available
          </p>
        </div>
      </Link>
    </>
  );
};

export default ProductCard;
