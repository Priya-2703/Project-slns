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

  const isInWishlist = wishlist.some((item) => item.id === product.id);

  const handleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
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
        to={`/product/${product.id}`}
        className="w-[250px] min-h-[550px] relative flex flex-col gap-4 cursor-pointer group"
      >
        <button
          onClick={(e) => {
            e.preventDefault(); // stop <Link> navigation
            e.stopPropagation(); // stop event bubbling
            handleWishlist();
          }}
          className="absolute top-3 right-3 z-20 rounded-[4px] w-9 h-9 bg-slate-800 flex justify-center items-center"
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
              <IoHeartSharp className="text-[19px] text-pink-600" />
            ) : (
              <GoHeart className="text-[18px] text-white" />
            )}
          </motion.div>
        </button>
        <div className="relative overflow-hidden rounded-[12px]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        <div className="flex justify-between items-start text-white">
          <div className="flex flex-col justify-center items-start gap-3">
            <h1 className="w-[90%] text-[18px] font2-bold capitalize leading-7">
              {product.name}
            </h1>
            <p className="font2 text-[16px] leading-none">₹{product.price}</p>
          </div>
          <div className="flex flex-col justify-center items-start gap-3">
            <p className="px-2 py-1 border-2 border-white text-[16px] font2">
              {product.discount}%
            </p>
            <p className="text-gray-500 line-through font2 text-[16px]">
              ₹{product.actualPrice}
            </p>
          </div>
        </div>
        <div className="flex justify-start">
          <p className="text-white/65 tracking-wide font2 capitalize text-[12px] leading-0">
            {product.id + 2} styling Available
          </p>
        </div>
      </Link>
    </>
  );
};

export default ProductCard;
