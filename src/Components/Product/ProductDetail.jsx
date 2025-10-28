import { useContext, useEffect, useMemo, useState } from "react";
import { assets } from "../../../public/assets/asset";
import "./product.css";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdVerified,
} from "react-icons/md";
import ProductSwiper from "./ProductSwiper";
import { Link, useLocation, useParams } from "react-router-dom";
import UseFetchData from "../../Hooks/UseFetchData";
import { FaArrowLeft } from "react-icons/fa";
import { CartContext } from "../../Context/UseCartContext";
import { ToastContext } from "../../Context/UseToastContext";
import { ReviewContext } from "../../Context/UseReviewContext";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import DarkVeil from "../DarkVeil";

const img = [`${assets.dhosti1}`, `${assets.dhosti2}`, `${assets.dhosti3}`];
const images = [
  {
    img: "https://framerusercontent.com/images/vPcvfK8IU12P4Vgp663O0iRQd6M.jpg",
    chudi:
      "https://framerusercontent.com/images/SohnIOXBcxmvcexlPGTV5XapKK4.jpg",
    saree: "product-1",
  },
  {
    img: "https://framerusercontent.com/images/ccbbJXnnIDzInGCc1JFwzcE.jpg",
    chudi:
      "https://framerusercontent.com/images/Wa9VEYx9s6XaxR5umPBFrfvfyY.jpg",
    saree: "product-2",
  },
  {
    img: "https://framerusercontent.com/images/Wvrz45r4Zj4B5KD8o12Ssn0jC3E.jpg",
    chudi: "https://framerusercontent.com/images/mPWFBSxkUJmgCdKvoj6XUOxI.jpg",
    saree: "product-3",
  },
  {
    img: "https://framerusercontent.com/images/7HrtBqUFUzLsm7pp25KlmtayTrM.jpg",
    chudi:
      "https://framerusercontent.com/images/fb0bmgkk54m5ZnqtMYvdYT3JrtY.jpg",
    saree: "product-4",
  },
  {
    img: "https://framerusercontent.com/images/y0pIZkQ9R2JFDsr0ZcKyYB2FbPI.jpg",
    chudi:
      "https://framerusercontent.com/images/LIAid0O7FSPivaZ01F52rn0RUI.jpg",
    saree: "product-5",
  },
  {
    img: "https://framerusercontent.com/images/kmuIrwM7mas4h0unNvDA2hcJeng.jpg",
    chudi:
      "https://framerusercontent.com/images/SohnIOXBcxmvcexlPGTV5XapKK4.jpg",
    saree: "product-6",
  },
  {
    img: "https://framerusercontent.com/images/Q0ih86EcQhWKKGCX5VU05ql9c.jpg",
    chudi:
      "https://framerusercontent.com/images/Wa9VEYx9s6XaxR5umPBFrfvfyY.jpg",
    saree: "product-7",
  },
  {
    img: "https://framerusercontent.com/images/88o9uv2eF0dKK5oEmNHMECrVOqE.jpg",
    chudi: "https://framerusercontent.com/images/mPWFBSxkUJmgCdKvoj6XUOxI.jpg",
    saree: "product-8",
  },
  {
    img: "https://framerusercontent.com/images/loLqOcRkx7RXtQdl11HzDqQMvTA.jpg",
    chudi:
      "https://framerusercontent.com/images/fb0bmgkk54m5ZnqtMYvdYT3JrtY.jpg",
    saree: "product-9",
  },
  {
    img: "https://framerusercontent.com/images/QhPI9HoY4jWY1elsLaRanKqE0.jpg",
    chudi:
      "https://framerusercontent.com/images/LIAid0O7FSPivaZ01F52rn0RUI.jpg",
    saree: "product-10",
  },
];

const ProductDetail = () => {
  const [product, setProduct] = useState({});
//   const [productImages, setProductImages] = useState([]); // 🆕 Multiple images
  const [loading, setLoading] = useState(true);
  const { cart, addToCart } = useContext(CartContext);
  const { id } = useParams();
  const { showToast } = useContext(ToastContext);
  const location = useLocation();
  const [reviewsToShow, setReviewsToShow] = useState(4);

  // after submit review effect
  useEffect(() => {
    if (location.state?.showCelebration) {
      // Define all custom shapes
      var count = 200;
      var defaults = {
        origin: { y: 0.7 },
      };

      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });

      showToast(
        "🎉 Review Added Successfully! Thank you for your feedback!",
        "success"
      );
    }
  }, [location]);

  const handleCart = () => {
    if (isInCart) {
      showToast("Item already added in Cart", "success");
    } else {
      showToast("Item added in Cart", "success");
    }
  };

  // 🆕 Fetch product and its images from database
  useEffect(() => {
    if (data && data.length > 0) {
      const productId = parseInt(id);
      const foundProduct = data.find((item) => item.product_id === productId);
      setProduct(foundProduct);
    }
  };

  // Use useMemo to compute isInCart safely
  const isInCart = useMemo(() => {
    if (!product || !product.product_id) return false;
    return cart.some((item) => item.product_id === product.product_id);
  }, [cart, product]);

  const { getProductReviews, reviews, totalReviews } =
    useContext(ReviewContext);
  // Direct call without state
  const productReviews = getProductReviews(id);

  // Add this handler function
  const handleLoadMoreReviews = () => {
    setReviewsToShow((prev) => prev + 4);
  };

  // Get displayed reviews
  const displayedReviews = productReviews.slice(0, reviewsToShow);
  const hasMoreReviews = reviewsToShow < productReviews.length;

  const [cur, setCur] = useState(0);
  const [openIndex, setOpenIndex] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleImageClick = (e) => {
    if (!isZoomed) {
      setIsZoomed(true);
    } else if (!isDragging) {
      setIsZoomed(false);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e) => {
    if (isZoomed) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && isZoomed) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const prev = () => setCur((cur) => (cur === 0 ? productImages.length - 1 : cur - 1));
  const next = () => setCur((cur) => (cur === productImages.length - 1 ? 0 : cur + 1));

  if (loading) {
    return (
      <div className="w-full bg-black min-h-screen flex items-center justify-center mt-28">
        <div className="text-white text-2xl font2">Loading product...</div>
      </div>
    );
  }

  if (!product || !product.product_id) {
    return (
      <div className="w-full bg-black min-h-screen flex items-center justify-center mt-28">
        <div className="text-white text-2xl font2">Product not found</div>
      </div>
    );
  }

  const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-image.png'; // Fallback image
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If relative path, prepend backend URL
  if (imagePath.startsWith('/static/')) {
    return `http://localhost:5000${imagePath}`;
  }
  
  return imagePath;
};

  const backButtonVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      rotate: -180,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.7,
        ease: [0.34, 1.56, 0.64, 1],
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  };

  const [showTryOn, setShowTryOn] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);
  const [userPhotoFile, setUserPhotoFile] = useState(null);
  const [tryOnResult, setTryOnResult] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Handle Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserPhoto(event.target.result);
        setSelectedModel(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Simulate Virtual Try-On Process (Frontend Only)
  const startVirtualTryOn = () => {
    if (!userPhoto) {
      showToast("Please select a photo first! 📸", "error");
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    // Simulate processing with progress
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress > 100) currentProgress = 100;

      setProgress(Math.floor(currentProgress));

      if (currentProgress >= 100) {
        clearInterval(progressInterval);

        // Demo: Show product image as result (actual la API result varum)
        setTimeout(() => {
          setTryOnResult(product.image_url);
          setIsProcessing(false);
          showToast("Virtual Try-On Complete! Looking Great! 🎉", "success");

          // Celebration effect
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }, 500);
      }
    }, 300);
  };

  // Reset Everything
  const resetTryOn = () => {
    setUserPhoto(null);
    setUserPhotoFile(null);
    setTryOnResult("");
    setProgress(0);
    setSelectedModel(null);
    setIsProcessing(false);
  };

  // Close Modal
  const closeTryOnModal = () => {
    setShowTryOn(false);
    resetTryOn();
  };

  // Share Result (Frontend only)
  const shareResult = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Check out this ${product.product_name}!`,
          text: "I tried this virtually and it looks amazing!",
          url: window.location.href,
        })
        .catch(() => {
          showToast("Copied link to clipboard! 📋", "success");
        });
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard! 📋", "success");
    }
  };

  // Download Image (Frontend only)
  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = tryOnResult;
    link.download = `virtual-tryon-${product.product_name}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Image Downloaded! Check your downloads folder 📥", "success");
  };

  return (
    <>
      <div className="w-full bg-black mx-auto mt-14 md:mt-28 py-20 overflow-x-hidden">
        <motion.div
          variants={backButtonVariants}
          className="absolute top-[90px] left-5 md:top-[130px] lg:top-[154px] md:left-[30px] lg:left-[100px] z-20"
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
        <div className="w-[90%] lg:w-[85%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-7">
          {/* image */}
          <div className="flex lg:sticky lg:top-10 justify-center items-start px-2">
            <div className="relative overflow-hidden w-full h-[400px] md:h-[600px] lg:h-[900px] flex rounded-4xl">
              {img.map((item, id) => (
                <img
                  key={id}
                  src={product.image_url}
                  alt="img"
                  loading="lazy"
                  className={`object-cover object-center min-w-full transition-all ease-out duration-500 ${
                    isZoomed ? "cursor-move" : "cursor-zoom-in"
                  }`}
                  style={{
                    transform: `translateX(-${cur * 100}%) scale(${
                      isZoomed ? 2 : 1
                    }) translate(${isZoomed ? position.x : 0}px, ${
                      isZoomed ? position.y : 0
                    }px)`,
                    }}
                    onClick={handleImageClick}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    draggable={false}
                  />
                ))}

                {!isZoomed && productImages.length > 1 && (
                  <>
                    <div className="absolute inset-0 flex justify-between items-center px-5">
                      <button
                        onClick={prev}
                        className="bg-black/80 p-2 rounded-full flex justify-center cursor-pointer items-center hover:bg-black/90 transition-colors"
                      >
                        <MdKeyboardArrowLeft className="text-white text-[22px]" />
                      </button>
                      <button
                        onClick={next}
                        className="bg-black/80 p-2 rounded-full flex justify-center cursor-pointer items-center hover:bg-black/90 transition-colors"
                      >
                        <MdKeyboardArrowRight className="text-white text-[22px]" />
                      </button>
                    </div>
                    
                    {/* Image Type Badge */}
                    <div className="absolute top-4 left-4 bg-[#955E30] text-white px-3 py-1 rounded-full text-xs font2">
                      {productImages[cur]?.image_type === 'primary' ? 'Base Image' : 'Detail Shot'}
                    </div>
                    
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2">
                      {productImages.map((img, index) => (
                        <div
                          key={index}
                          className={`w-1.5 h-1.5 bg-white rounded-full transition-all cursor-pointer ${
                            cur === index ? "p-2" : "bg-opacity-50"
                          }`}
                          onClick={() => setCur(index)}
                        ></div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery - 🆕 NEW */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {productImages.map((imageObj, index) => (
                    <div
                      key={index}
                      onClick={() => setCur(index)}
                      className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                        cur === index ? 'border-[#955E30]' : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <img
                        src={imageObj.image_url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-24 object-cover"
                      />
                      {imageObj.image_type === 'primary' && (
                        <div className="absolute top-1 left-1 bg-[#955E30] text-white text-[8px] px-1.5 py-0.5 rounded font2">
                          Base
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* content */}
          <div className="flex flex-col justify-start h-auto items-start px-3 lg:px-20 py-3">
            <div className="flex justify-start items-start">
              <p className="text-white text-[12px] tracking-wide font-body">
                {product.category_name}
              </p>
            </div>
            <div className="text-white lg:mt-20 mb-3">
              <h1 className="font-heading font-[950] text-[35px] md:text-[55px] leading-none">
                {product.product_name}
              </h1>
            </div>
            {/* <div className="text-white mt-14">
              <h1 className="font-body border border-white tracking-wider p-2 text-[18px]">
                {product.stockStatus}
              </h1>
            </div> */}
            <div className="text-white my-3 md:my-5 border-t border-t-white/10 border-b border-b-white/10 flex justify-between items-center w-full py-3 px-1">
              <p className="font-['Poppins'] font-semibold text-[18px] md:text-[24px]">
                ₹{product.price}
              </p>
              <div className="flex justify-center items-center gap-3">
                <p className="font-['Poppins'] line-through text-white/30 text-[14px]">
                  ₹{(product.price * 1.2).toFixed(2)}
                </p>
                <p className="font-['Poppins'] text-[14px]">20% OFF</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-white text-[12px] tracking-wide font-body">
                Choose Other Versions
              </h1>
              <div className="flex items-center gap-2">
                <img
                  src={assets.dhosti1}
                  alt="img"
                  loading="lazy"
                  className="w-[50px] h-[50px] object-cover object-center"
                />
                <img
                  src={assets.dhosti1}
                  alt="img"
                  loading="lazy"
                  className="w-[50px] h-[50px] object-cover object-center"
                />
                <img
                  src={assets.dhosti1}
                  alt="img"
                  loading="lazy"
                  className="w-[50px] h-[50px] object-cover object-center"
                />
                <img
                  src={assets.dhosti1}
                  alt="img"
                  loading="lazy"
                  className="w-[50px] h-[50px] object-cover object-center"
                />
                <img
                  src={assets.dhosti1}
                  alt="img"
                  loading="lazy"
                  className="w-[50px] h-[50px] object-cover object-center"
                />
              </div>
            </div>
            <div className="flex flex-wrap md:flex-nowrap items-center mt-4 md:mt-7 gap-1">
              {product?.sizes?.map((size, id) => (
                <div
                  key={id}
                  className="bg-accet capitalize rounded-sm min-w-[60px] px-2 py-1 flex justify-center items-center font-body text-white text-[14px] font-medium hover:bg-accet/80 transition-all duration-200 cursor-pointer"
                >
                  {size}
                </div>
              ))}
            </div>

            <div className="flex w-full flex-col py-8 md:mt-5 gap-3">
              <button className="text-[16px] text-black px-3 py-4 font-medium font-body rounded-lg w-full bg-white hover:scale-[1.02] transition-all">
                Purchase Now
              </button>

              <Link to={"/cart"}>
                <button
                  onClick={() => {
                    addToCart(product);
                    handleCart();
                  }}
                  className="text-[16px] text-white px-3 py-4 font-body rounded-[8px] w-full bg-accet hover:scale-[1.02] transition-all"
                >
                  Add to Cart
                </button>
              </Link>

              {/* Virtual Try-On Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowTryOn(true)}
                className="relative text-[16px] text-white px-3 py-4 font-body rounded-[8px] w-full overflow-hidden group"
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-[length:200%_100%] animate-gradient" />
                <span className="relative flex items-center justify-center gap-2">
                  <span className="text-lg">✨</span>
                  Virtual Try-On
                  <span className="text-lg">👗</span>
                </span>
              </motion.button>
            </div>

            <div className="w-full flex flex-col items-center px-2">
              <div className="w-full border-b border-b-white/10 pb-1 mt-5">
                <button
                  type="button"
                  onClick={() => toggle(0)}
                  className="w-full flex justify-between items-center font-body text-[16px] text-white cursor-pointer select-none"
                  aria-expanded={openIndex === 0}
                >
                  Product Description
                  <svg
                    className={`h-6 w-6 transition-transform duration-300 ${
                      openIndex === 0 ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div
                  className={`mt-3 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                    openIndex === 0 ? "opacity-100 max-h-96" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="mt-2 pb-5">
                    <ul className="space-y-5 leading-normal text-[12px] font-body text-white">
                      {/* <li className="pl-2">Dhoti Border Design May Vary</li> */}
                      <li className="pl-2">{product.description}</li>
                      {product?.washCare?.map((item, id) => (
                        <li key={id} className="pl-2">
                          {item}
                        </li>
                      ))}

                      {/* <li className="pl-2">Wash separately.</li>
                      <li className="pl-2">Use white Colour detergents.</li>
                      <li className="pl-2">Gentle Wash.</li>
                      <li className="pl-2">Don't use fabric bluing agents.</li> */}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="w-full border-b border-b-white/10 pb-1 mt-5">
                <button
                  type="button"
                  onClick={() => toggle(1)}
                  className="w-full flex justify-between items-center font-body text-[16px] text-white cursor-pointer select-none"
                  aria-expanded={openIndex === 1}
                >
                  Item Details
                  <svg
                    className={`h-6 w-6 transition-transform duration-300 ${
                      openIndex === 1 ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div
                  className={`mt-3 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                    openIndex === 1 ? "opacity-100 max-h-96" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="mt-2 pb-5">
                    <ul className="space-y-5 leading-normal text-[12px] font-body text-white">
                      <li className="pl-2">
                        Material - {product?.details?.Material}
                      </li>
                      <li className="pl-2 flex items-center gap-2">
                        <span className="text-white/60">Category:</span>
                        <span>{product.category_name}</span>
                      </li>
                      <li className="pl-2 flex items-center gap-2">
                        <span className="text-white/60">Product ID:</span>
                        <span>#{product.product_id}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="w-full border-b border-b-white/10 pb-1 mt-5 ">
                <button
                  type="button"
                  onClick={() => toggle(2)}
                  className="w-full flex justify-between items-center font-body text-[16px] text-white cursor-pointer select-none"
                  aria-expanded={openIndex === 2}
                >
                  Delivery and Return
                  <svg
                    className={`h-6 w-6 transition-transform duration-300 ${
                      openIndex === 2 ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div
                  className={`pl-4 mt-3 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                    openIndex === 2 ? "opacity-100 max-h-[500px]" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="mt-2">
                    <h3 className="font-body text-white text-[12px]">
                      Delivery:
                    </h3>

                    <ul className="list-disc list-inside space-y-1 text-[10px] leading-normal font-body text-gray-100">
                      <li className="pl-2">
                        Delivery is made by express courier, within 2-5 working
                        days from the confirmation of the order.
                      </li>
                      <li className="pl-2">
                        The delivery cost is 100 INR for orders under 1000 INR
                        and free for orders over 1000 INR.
                      </li>
                      <li className="pl-2">
                        You can choose to have your order delivered to an
                        address specified by you or to a pick-up point.
                      </li>
                      <li className="pl-2">
                        You will receive an email with the delivery confirmation
                        and a tracking code for the parcel.
                      </li>
                    </ul>
                  </div>
                  <div className="mt-2">
                    <h3 className="font-body text-white text-[12px]">
                      Return:
                    </h3>

                    <ul className="list-disc list-inside space-y-1 text-[10px] leading-normal font-body text-gray-100">
                      <li className="pl-2">
                        You can return the products within 14 days of receipt,
                        without giving any reason.
                      </li>
                      <li className="pl-2">
                        The cost of returning the products is borne by the
                        customer.
                      </li>
                      <li className="pl-2">
                        Products can be returned by express courier or to a
                        pick-up point.
                      </li>
                      <li className="pl-2">
                        Products must be returned in their original packaging,
                        with labels intact and with the documents received in
                        the parcel.
                      </li>
                      <li className="pl-2">
                        The refund of the value of the products will be made
                        within 14 days of receipt of the return.
                      </li>
                    </ul>
                  </div>
                  <div className="mt-2">
                    <h3 className="font-body text-white text-[12px]">
                      Exceptions to return:
                    </h3>

                    <ul className="list-disc list-inside space-y-1 text-[10px] leading-normal font-body text-gray-100">
                      <li className="pl-2">
                        Products that have been worn, damaged or modified cannot
                        be returned.
                      </li>
                      <li className="pl-2">
                        Products that have been made to order or personalized
                        cannot be returned.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* review */}
        <div className="w-[90%] mx-auto lg:px-10 py-7 md:mt-5">
          <div className="flex justify-start items-center">
            <h1 className="text-white font-heading text-[28px] md:text-[46px] font-[950] capitalize">
              Reviews ({productReviews.length})
            </h1>
          </div>

          {/* Display reviews */}
          <div className="grid grid-cols-1 lg:grid-cols-2 items-start md:space-y-2">
            {displayedReviews.length > 0 ? (
              displayedReviews.map((review) => (
                <div
                  key={review.id}
                  className="flex items-start py-3 gap-4 md:gap-4 w-full"
                >
                  <div className="min-w-[80px] md:min-w-[150px] lg:min-w-[200px] flex flex-col justify-start items-start">
                    <p className="text-[12px] md:text-[14px] lg:text-[20px] text-white font-spectral uppercase">
                      {review.name}
                    </p>
                    <p className="text-[10px] md:text-[14px] font-body flex justify-center items-center gap-2 text-white">
                      Verified Buyer{" "}
                      <MdVerified className="text-white text-[16px]" />
                    </p>
                  </div>
                  <div className="w-full flex flex-col justify-start items-start gap-1 md:gap-2">
                    <p className="text-[18px] md:text-[22px] text-white font-body uppercase">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </p>
                    <p className="text-[12px] md:text-[16px] font-body flex capitalize justify-center items-center gap-2 text-white">
                      "{review.review}"
                    </p>
                    {review.quality && (
                      <div className="flex justify-start items-center gap-3 md:gap-4">
                        <p
                          className={`text-white text-[8px] md:text-[12px] font-['Poppins'] border-b-2 px-2 md:px-4 py-1 ${
                            review.quality === "Poor"
                              ? "border-b-white"
                              : "border-b-white/20"
                          }`}
                        >
                          Poor
                        </p>
                        <p
                          className={`text-white text-[8px] md:text-[12px] font-['Poppins'] border-b-2 px-2 md:px-4 py-1 ${
                            review.quality === "Good"
                              ? "border-b-white"
                              : "border-b-white/20"
                          }`}
                        >
                          Good
                        </p>
                        <p
                          className={`text-white text-[8px] md:text-[12px] font-['Poppins'] border-b-2 px-2 md:px-4 py-1 ${
                            review.quality === "Awesome"
                              ? "border-b-white"
                              : "border-b-white/20"
                          }`}
                        >
                          Awesome
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/60 font-body text-[14px] py-4">
                No reviews yet. Be the first to review this product!
              </p>
            )}
          </div>

          {/* Load More Button */}
          <div className="flex justify-center items-center">
            {hasMoreReviews && (
              <button
                onClick={handleLoadMoreReviews}
                className="flex justify-center items-center px-3 py-2  bg-white hover:bg-white/20 hover:text-white transition-colors cursor-pointer text-[10px] md:text-[14px] text-black font-body font-medium mt-3 rounded-[50px]"
              >
                ...({productReviews.length - reviewsToShow}) More Reviews
              </button>
            )}
          </div>

          <Link to={`/product/${id}/product-review`}>
            <button className="w-full py-2 bg-accet cursor-pointer text-[14px] md:text-[18px] text-white font-body mt-3 md:mt-8 rounded-[5px]">
              Write a Review for this Product
            </button>
          </Link>
        </div>

        {/* The Wardrobe Hub */}
        <div
          className={`w-full mx-auto md:mt-7 py-6 ${
            product.gender == "Male" ? "hidden" : "block"
          }`}
        >
          <div className="flex flex-col justify-center items-center py-3 md:mb-10">
            <p className="text-[12px] text-white capitalize tracking-wide leading-none font-body">
              We give you more
            </p>
            <h1 className="text-[38px] lg:text-[64px] text-white capitalize tracking-wide leading-8 font-[950] font-heading">
              The Wardrobe Hub
            </h1>
          </div>

          <div className="overflow-hidden relative grid grid-cols-1 py-2 bg-black">
            <div className="flex justify-center items-center gap-4 productCard-wrapper">
              {images.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`sareeProduct ${item.saree} flex flex-col justify-center items-center`}
                  >
                    <img
                      src={
                        product.category == "Chudidhars" ? item.chudi : item.img
                      }
                      alt={item.saree}
                      loading="lazy"
                      className="object-cover w-[150px] h-[250px] md:w-[200px] md:h-[300px] object-center rounded-3xl"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Similar products */}
        <div className="w-full mx-auto mt-7 py-6">
          <div className="flex flex-col justify-center items-center md:mb-6">
            <p className="text-[12px] text-white uppercase tracking-wide leading-none font-body">
              RECOMMENDATIONS FOR YOU
            </p>
            <h1 className="text-[38px] lg:text-[64px] text-white capitalize tracking-wide leading-7 md:leading-12 font-[950] font-heading">
              Similar products
            </h1>
          </div>

          <div className="w-[90%] mx-auto py-8">
            <div className="w-[300px] flex flex-col gap-4 cursor-pointer group">
              <div className="relative overflow-hidden rounded-[12px]">
                <img
                  src={assets.dhosti1}
                  alt="img"
                  loading="lazy"
                  className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="flex justify-between items-start text-white">
                <div className="flex flex-col justify-center items-start gap-3">
                  <h1 className="w-[90%] text-[16px] font-semibold font-body capitalize leading-6">
                    Men Matching Border Dhoti & Half Sleeves Shirt Set Maroon
                    C81
                  </h1>
                  <p className="font-body text-[14px] leading-none">₹1,200</p>
                </div>
                <div className="flex flex-col justify-center items-start gap-3">
                  <p className="px-2 py-1 border-2 border-white text-[14px] font-body">
                    20%
                  </p>
                  <p className="text-gray-500 line-through font-body text-[14px]">
                    ₹1,500
                  </p>
                </div>
              </div>
              <div className="flex justify-start">
                <p className="text-white/65 tracking-wide font-body capitalize text-[10px] leading-0">
                  0 styling Available
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Curated Styles for Everyone */}
        <div className="w-full mx-auto lg:mt-7 py-6">
          <div className="flex flex-col gap-2 justify-center items-center">
            <h1 className="text-[35px] lg:text-[64px] text-center text-white capitalize tracking-wide leading-none font-[950] font-heading">
              Curated Styles for Everyone
            </h1>
          </div>
          <ProductSwiper />
        </div>
      </div>

      {/* Virtual Try-On Modal - Complete Frontend Only */}
      {showTryOn && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/95 z-50 flex font-body items-center justify-center p-4"
          onClick={closeTryOnModal}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-linear-to-b from-gray-900 to-black rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gray-900/95 backdrop-blur p-5 border-b border-white/10 z-50">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-[18px] md:text-2xl font-heading font-bold text-white">
                    Virtual Try-On
                  </h2>
                  <p className="text-white/50 text-[10px] md:text-sm font-body">
                    See how it looks on you!
                  </p>
                </div>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  onClick={closeTryOnModal}
                  className="text-white/60 hover:text-white text-2xl"
                >
                  <X />
                </motion.button>
              </div>
            </div>

            <div
              style={{ width: "100%", height: "400px", position: "relative" }}
              className="w-[90%] mx-auto h-[50vh] text-white text-[30px] font-body flex justify-center items-center"
            >
              <DarkVeil />
              <p className="absolute">Coming Soon</p>
            </div>

            {/* place here the below tryon content code */}
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default ProductDetail;

// tryon code place there
{
  /* Content */
}
// <div className="p-5">
//   {!tryOnResult ? (
//     <>
//       {/* Product Preview */}
//       <motion.div
//         initial={{ x: -20, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         className="flex items-center gap-3 p-2 md:p-3 bg-linear-to-r from-purple-900/20 to-pink-900/20 rounded-2xl mb-5"
//       >
//         <img
//           src={product.image_url}
//           alt={product.product_name}
//           loading="lazy"
//           className="md:w-20 md:h-20 w-16 h-16 object-cover rounded-xl"
//         />
//         <div className="flex-1">
//           <p className="text-white font-medium text-sm truncate">
//             {product.product_name}
//           </p>
//           <div className="flex items-center gap-2 mt-1">
//             <p className="text-white font-bold">₹{product.price}</p>
//             <p className="text-accet text-xs line-through">
//               ₹{product.actualPrice}
//             </p>
//           </div>
//         </div>
//       </motion.div>

//       {/* Upload Section */}
//       {!userPhoto ? (
//         <motion.div
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.1 }}
//         >
//           {/* Upload Button */}
//           <label className="block cursor-pointer">
//             <motion.div
//               whileHover={{ scale: 1.02 }}
//               className="border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 rounded-2xl p-10 text-center transition-all bg-linear-to-b from-purple-900/10 to-transparent"
//             >
//               <div className="text-5xl mb-3">📸</div>
//               <p className="text-white text-[13px] md:text-[16px] font-medium font-body">
//                 Upload Your Photo
//               </p>
//               <p className="text-white/40 text-[8px] md:text-sm mt-1">
//                 Full body, facing front • Max 5MB
//               </p>
//               <input
//                 type="file"
//                 className="hidden"
//                 accept="image/*"
//                 onChange={handlePhotoUpload}
//               />
//             </motion.div>
//           </label>
//         </motion.div>
//       ) : (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="space-y-4"
//         >
//           {/* Selected Photo */}
//           <div className="relative rounded-2xl overflow-hidden z-10">
//             <img
//               src={userPhoto}
//               alt="Selected"
//               loading="lazy"
//               className="w-full h-full object-cover"
//             />
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               onClick={() => resetTryOn()}
//               className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full"
//             >
//               <X />
//             </motion.button>
//           </div>

//           {/* Process Button */}
//           <motion.button
//             whileHover={{ scale: isProcessing ? 1 : 1.02 }}
//             whileTap={{ scale: isProcessing ? 1 : 0.98 }}
//             onClick={startVirtualTryOn}
//             disabled={isProcessing}
//             className={`w-full py-3 md:py-4 rounded-2xl font-medium transition-all ${
//               isProcessing
//                 ? "bg-gray-800 cursor-not-allowed"
//                 : "bg-linear-to-r from-purple-600 to-pink-600 hover:shadow-xl hover:shadow-purple-500/25"
//             } text-white`}
//           >
//             {isProcessing ? (
//               <div className="space-y-3">
//                 <div className="flex items-center justify-center gap-2">
//                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                   <span>Processing... {progress}%</span>
//                 </div>
//                 <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
//                   <motion.div
//                     className="h-full bg-linear-to-r from-purple-500 to-pink-500"
//                     animate={{ width: `${progress}%` }}
//                     transition={{ duration: 0.3 }}
//                   />
//                 </div>
//               </div>
//             ) : (
//               <span className="flex items-center text-[12px] md:text-[16px] justify-center gap-2">
//                 <span>Generate Try-On</span>
//                 <span>🪄</span>
//               </span>
//             )}
//           </motion.button>

//           {/* Info */}
//           <p className="text-white/40 text-[10px] md:text-xs text-center">
//             AI processing takes 05-30 seconds
//           </p>
//         </motion.div>
//       )}
//     </>
//   ) : (
//     /* Result Section */
//     <motion.div
//       initial={{ opacity: 0, scale: 0.95 }}
//       animate={{ opacity: 1, scale: 1 }}
//       className="space-y-3 md:space-y-4"
//     >
//       {/* Success Message */}
//       <div className="text-center py-3">
//         <motion.div
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ type: "spring", delay: 0.2 }}
//           className="text-3xl md:text-5xl mb-2"
//         >
//           🎉
//         </motion.div>
//         <h3 className="text-white text-[17px] md:text-xl font-heading font-bold">
//           Looking Fantastic!
//         </h3>
//         <p className="text-white/60 text-[10px] md:text-sm mt-1">
//           Here's your virtual try-on result
//         </p>
//       </div>

//       {/* Result Image */}
//       <div className="relative rounded-2xl overflow-hidden">
//         <img
//           src={tryOnResult}
//           loading="lazy"
//           alt="Try-on result"
//           className="w-full"
//         />
//         <div className="absolute top-3 left-3 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full">
//           <p className="text-white text-[10px] md:text-xs font-medium flex items-center gap-1">
//             <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
//             AI Generated
//           </p>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="grid grid-cols-2 gap-3">
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={downloadImage}
//           className="py-2 md:py-3 bg-white text-black rounded-xl text-[12px] md:text-[16px] font-medium"
//         >
//           Download 📥
//         </motion.button>

//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={shareResult}
//           className="py-2 md:py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white text-[12px] md:text-[16px] rounded-xl font-medium"
//         >
//           Share 🔗
//         </motion.button>
//       </div>

//       {/* Try Another */}
//       <motion.button
//         whileHover={{ scale: 1.02 }}
//         onClick={resetTryOn}
//         className="w-full py-2 md:py-3 border border-white/20 text-[12px] md:text-[16px] text-white rounded-xl font-medium hover:bg-white/5 transition-colors"
//       >
//         Try Another Photo 🔄
//       </motion.button>

//       {/* Add to Cart from Result */}
//       <motion.button
//         whileHover={{ scale: 1.02 }}
//         onClick={() => {
//           addToCart(product);
//           closeTryOnModal();
//           showToast("Added to cart! 🛒", "success");
//         }}
//         className="w-full py-2 md:py-3 bg-accet text-[12px] md:text-[16px] text-white rounded-xl font-medium"
//       >
//         Add to Cart 🛒
//       </motion.button>
//     </motion.div>
//   )}
// </div>
