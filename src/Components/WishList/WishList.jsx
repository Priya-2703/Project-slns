import React, { useContext, useEffect, useRef } from "react";
import { FaArrowLeft, FaOpencart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { WishlistContext } from "../../Context/UseWishListContext";
import { X } from "lucide-react";
import { CartContext } from "../../Context/UseCartContext";
import { ToastContext } from "../../Context/UseToastContext";
import { motion, AnimatePresence, useInView } from "framer-motion";

const WishList = () => {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { cart, addToCart } = useContext(CartContext);
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
  document.title = `Wishlist (${wishlist.length}) - SLNS Sarees`;
}, [wishlist.length]);

  const isInCart = cart.some((item) => item.product_id === wishlist.product_id);

  const handleCart = () => {
    if (isInCart) {
      showToast("Item already added in Cart", "success");
    } else {
      showToast("Item added in Cart", "success");
    }
  };

  const mobileView = window.innerWidth < 480;

  // 🎨 Animation Variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const backButtonVariants = {
    hidden: { opacity: 0, x: -50, scale: 0.8 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const emptyStateVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  // 🎯 Row-based delay calculation
  const getColumnDelay = (index) => {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    let columns = 5; // lg: 4 columns for wishlist
    if (isMobile) columns = 2;
    else if (isTablet) columns = 3;

    const columnPosition = index % columns;

    return columnPosition * 0.08;
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.85,
    },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: getColumnDelay(index),
        ease: [0.22, 1, 0.36, 1],
        type: "spring",
        stiffness: 100,
      },
    }),
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="min-h-screen bg-black text-white mt-20 md:mt-32"
    >
      {/* Back Button */}
      <motion.div
        variants={backButtonVariants}
        className="absolute top-[90px] left-[20px] md:top-[130px] lg:top-[154px] md:left-[30px] lg:left-[100px] z-20"
        whileHover={{
          scale: 1.1,
          rotate: -5,
        }}
        whileTap={{ scale: 0.9 }}
      >
        <Link
          to={"/product"}
          aria-label="Go to product details"
          title="Go to Product"
          className="group inline-flex items-center justify-center rounded-full border border-neutral-700 bg-black p-2 text-gray-300 hover:text-white hover:border-gray-500 focus:outline-none backdrop-blur"
        >
          <motion.div whileHover={{ x: -3 }} transition={{ duration: 0.3 }}>
            <FaArrowLeft className="text-white text-[12px] md:text-[18px]" />
          </motion.div>
        </Link>
      </motion.div>

      {/* Title */}
      <div className="w-[90%] md:w-[80%] mx-auto flex justify-start items-center py-3 px-10">
        <motion.h1
          variants={titleVariants}
          className="mb-8 text-[20px] md:text-[50px] leading-none font-heading capitalize font-[950] text-white"
        >
          My Wishlist
        </motion.h1>
      </div>

      {/* Wishlist Product */}
      <div className="w-[90%] flex justify-center items-center mx-auto px-2 lg:px-4 py-2 pb-10">
        <AnimatePresence mode="wait">
          {wishlist.length === 0 ? (
            <motion.div
              key="empty"
              variants={emptyStateVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="h-fit flex justify-center items-center p-8 text-center font-body font-medium text-[13px] text-neutral-400"
            >
              Your wishlist is empty.
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              variants={gridVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 lg:px-5"
            >
              <AnimatePresence>
                {wishlist.map((item, index) => (
                  <WishlistCardWrapper
                    key={item.product_id}
                    item={item}
                    index={index}
                    variants={cardVariants}
                    mobileView={mobileView}
                    removeFromWishlist={removeFromWishlist}
                    addToCart={addToCart}
                    handleCart={handleCart}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// 🎯 Separate Component for Wishlist Card with useInView
const WishlistCardWrapper = ({
  item,
  index,
  variants,
  mobileView,
  removeFromWishlist,
  addToCart,
  handleCart,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false,
    amount: 0,
    margin: "0px 0px -50px 0px",
  });

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      layout
      exit="exit"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        to={`/product/${item.product_id}`}
        className="lg:w-[250px] w-40 min-h-[250px] md:w-[200px] md:min-h-[380px] lg:min-h-[550px] flex flex-col gap-2 md:gap-3 cursor-pointer group relative"
      >
        {/* Remove Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.15, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            removeFromWishlist(item.product_id);
          }}
          className="absolute top-2 right-2 lg:top-3 lg:right-3 z-40 rounded-sm lg:w-8 lg:h-8 w-6 h-6 cursor-pointer bg-gray-800 flex justify-center items-center"
        >
          <X size={mobileView ? 12 : 16} className="text-white" />
        </motion.button>

        {/* Image Container */}
        <div className="relative overflow-hidden rounded-[12px]">
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
            src={item.image_url}
            alt={item.product_name}
            loading="lazy"
            className="w-full h-[250px] md:h-[300px] lg:h-[400px] object-cover object-center group-hover:blur-[2px] transition-transform duration-500"
          />

          {/* Add to Cart Button */}
          <div className="absolute w-full flex justify-center bottom-0 translate-y-full group-hover:bottom-1/2 group-hover:translate-y-1/2 transition-all duration-500 ease-out">
            <motion.button
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(item);
                handleCart();
              }}
              className="w-15 h-15 flex justify-center items-center font-['Poppins'] hover:drop-shadow-[0px_0px_10px] rounded-full bg-white font-semibold text-[13px] tracking-wide text-accet hover:drop-shadow-[#bb5e00] hover:bg-[#bb5e00] hover:text-white transition-all duration-300"
            >
              <FaOpencart className="text-[30px]" />
            </motion.button>
          </div>
        </div>

        {/* Product Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex justify-between items-start text-white"
        >
          <div className="flex flex-col justify-center items-start gap-2">
            <h1 className="w-[90%] text-[12px] md:text-[14px] font-body font-semibold capitalize md:leading-5 line-clamp-2">
              {item.product_name}
            </h1>
            <p className="font-body text-[12px] md:text-[14px] leading-none">
              ₹{item.price}
            </p>
          </div>
          <div className="flex flex-col justify-center items-start gap-3">
            <motion.p
              whileHover={{ scale: 1.1 }}
              className="px-2 py-1 border-2 border-white text-[12px] md:text-[14px] font-body"
            >
              {item.discount}%
            </motion.p>
            <p className="text-gray-500 line-through font-body text-[12px] md:text-[14px]">
              ₹{item.actual_price}
            </p>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default WishList;
