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
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  ShoppingCart,
  Star,
  Package,
  Truck,
  RefreshCw,
  Check,
} from "lucide-react";
import DarkVeil from "../DarkVeil";
import Trending from "../pages/Trending";
import BuyTogether from "../FBT/BuyTogether";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const BACKEND_URL = import.meta.env.VITE_API_URL;
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const { cart, addToCart } = useContext(CartContext);
  const { id } = useParams();
  const { showToast } = useContext(ToastContext);
  const location = useLocation();
  const [reviewsToShow, setReviewsToShow] = useState(4);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [stockInfo, setStockInfo] = useState({
    quantity: 0,
    isLowStock: false,
    isOutOfStock: false,
  });

  // Update stock info when product loads
  useEffect(() => {
    if (product.stock_quantity !== undefined) {
      setStockInfo({
        quantity: product.stock_quantity,
        isLowStock: product.stock_quantity > 0 && product.stock_quantity < 20,
        isOutOfStock: product.stock_quantity === 0,
      });
    }
  }, [product.stock_quantity]);

  useEffect(() => {
    if (product.product_name) {
      document.title = `${product.product_name} - Your Store Name`;
    }
    return () => {
      document.title = "SLNS Sarees";
    };
  }, [product.product_name]);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      if (!product.category_id && !product.category_name) return;

      try {
        const response = await fetch(`${BACKEND_URL}/api/products`);
        const data = await response.json();

        const filtered = data.products
          .filter((p) => {
            const isNotCurrentProduct = p.product_id !== product.product_id;
            const isSameCategory =
              (product.category_id && p.category_id === product.category_id) ||
              (product.category_name &&
                p.category_name === product.category_name) ||
              (product.category && p.category === product.category);

            return isNotCurrentProduct && isSameCategory;
          })
          .slice(0, 5);

        setSimilarProducts(filtered);
      } catch (error) {
        console.error("Error fetching similar products:", error);
        setSimilarProducts([]);
      }
    };

    if (product.product_id) {
      fetchSimilarProducts();
    }
  }, [
    product.product_id,
    product.category_id,
    product.category_name,
    product.category,
  ]);

  const handleCart = () => {
    if (isInCart) {
      showToast("Item already added in Cart", "success");
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/api/products/${id}`);
        const data = await response.json();
        setProduct(data.product);
        console.log(data.product);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder-image.png";
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    return `${BACKEND_URL}${imagePath}`;
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const canAddToCart = useMemo(() => {
    // ✅ Check stock first
    if (stockInfo.isOutOfStock) {
      return false;
    }

    // Then check size selection
    if (product.sizes && product.sizes.length > 0) {
      return selectedSize !== null;
    }

    return true;
  }, [product.sizes, selectedSize, stockInfo.isOutOfStock]);

  const isInCart = useMemo(() => {
    if (!product || !product.product_id) return false;
    return cart.some((item) => item.product_id === product.product_id);
  }, [cart, product]);

  const { fetchProductReviews, loading: reviewsLoading } =
    useContext(ReviewContext);
  const [productReviews, setProductReviews] = useState([]);

  useEffect(() => {
    const loadReviews = async () => {
      const reviews = await fetchProductReviews(id);
      setProductReviews(reviews);
    };

    if (id) {
      loadReviews();
    }
  }, [id, fetchProductReviews]);

  useEffect(() => {
    if (location.state?.showCelebration) {
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

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });

      showToast(
        "🎉 Review Added Successfully! Thank you for your feedback!",
        "success"
      );
    }
  }, [location, fetchProductReviews]);

  const handleLoadMoreReviews = () => {
    setReviewsToShow((prev) => prev + 4);
  };

  const handleAddToCart = async () => {
    // ✅ Check stock first
    if (stockInfo.isOutOfStock) {
      showToast(t("product_detail.stock.out_of_stock_toast"), "error");
      return;
    }

    // ✅ Check size selection
    if (!canAddToCart) {
      showToast("Please select a size first! 📏", "error");
      return;
    }

    // ✅ Check if adding quantity exceeds stock
    const itemInCart = cart.find(
      (item) => item.product_id === product.product_id
    );
    const currentQuantityInCart = itemInCart ? itemInCart.quantity : 0;

    if (currentQuantityInCart >= stockInfo.quantity) {
      showToast(
        `Only ${stockInfo.quantity} items available in stock!`,
        "error"
      );
      return;
    }

    await addToCart({
      ...product,
      selectedSize: selectedSize,
    });
  };

  useEffect(() => {
    setSelectedSize(null);
  }, [id, product.product_id]);

  const displayedReviews = productReviews.slice(0, reviewsToShow);
  const hasMoreReviews = reviewsToShow < productReviews.length;
  const [cur, setCur] = useState(0);
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const totalSlides =
    (product.images?.length || 0) + (product.video_url ? 1 : 0);

  const prev = () => {
    if (totalSlides === 0) return;
    setCur((cur) => (cur === 0 ? totalSlides - 1 : cur - 1));
  };

  const next = () => {
    if (totalSlides === 0) return;
    setCur((cur) => (cur === totalSlides - 1 ? 0 : cur + 1));
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
  const [selectedModel, setSelectedModel] = useState(null);

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

  const startVirtualTryOn = () => {
    if (!userPhoto) {
      showToast("Please select a photo first! 📸", "error");
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress > 100) currentProgress = 100;

      setProgress(Math.floor(currentProgress));

      if (currentProgress >= 100) {
        clearInterval(progressInterval);

        setTimeout(() => {
          setTryOnResult(product.image_url);
          setIsProcessing(false);
          showToast("Virtual Try-On Complete! Looking Great! 🎉", "success");

          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }, 500);
      }
    }, 300);
  };

  const resetTryOn = () => {
    setUserPhoto(null);
    setUserPhotoFile(null);
    setTryOnResult("");
    setProgress(0);
    setSelectedModel(null);
    setIsProcessing(false);
  };

  const closeTryOnModal = () => {
    setShowTryOn(false);
    resetTryOn();
  };

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
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard! 📋", "success");
    }
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = tryOnResult;
    link.download = `virtual-tryon-${product.product_name}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Image Downloaded! Check your downloads folder 📥", "success");
  };

  if (!product || !product.product_id) {
    return (
      <div className="w-full bg-black min-h-screen flex items-center justify-center mt-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-white text-2xl font2"
        >
          {t("product_detail.not_found")}
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full bg-black mx-auto mt-14 md:mt-28 py-20 overflow-x-hidden">
        {/* Back Button - Enhanced */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={backButtonVariants}
          className="absolute top-[90px] left-5 md:top-[130px] lg:top-[154px] md:left-[30px] lg:left-[100px] z-20"
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
        >
          <Link
            to={"/product"}
            aria-label="Go to product details"
            title="Go to Product"
            className="group relative inline-flex items-center justify-center rounded-full border border-white/20 bg-black/60 backdrop-blur-xl p-3 text-gray-300 hover:text-white hover:border-white/40 focus:outline-none transition-all duration-300 shadow-xl hover:shadow-white/20"
          >
            <motion.div whileHover={{ x: -3 }} transition={{ duration: 0.3 }}>
              <FaArrowLeft className="text-white text-[14px] md:text-[16px]" />
            </motion.div>

            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-linear-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/20 group-hover:to-pink-500/20 blur-xl transition-all duration-500" />
          </Link>
        </motion.div>

        <div className="w-[90%] md:w-[80%] lg:w-[85%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Image Gallery - Enhanced */}
          <div className="flex lg:sticky lg:top-10 justify-center items-center px-2">
            <div className="relative overflow-hidden w-full h-[400px] md:h-[700px] lg:h-[800px] flex rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl border-2 border-white/10">
              {product.images?.map((img, index) => (
                <img
                  key={index}
                  src={getImageUrl(img.image_url)}
                  alt={img.image_name}
                  className="object-cover object-center min-w-full"
                  style={{
                    transform: `translateX(-${cur * 100}%)`,
                  }}
                />
              ))}

              {/* Video Slide */}
              {product.video_url && (
                <div
                  className="min-w-full transition-all ease-out duration-500 relative"
                  style={{
                    transform: `translateX(-${cur * 100}%)`,
                  }}
                >
                  <video
                    src={product.video_url}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-6 left-6 bg-gradient-to-r from-red-600/90 to-orange-600/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 shadow-lg"
                  >
                    <p className="text-white text-sm font-body flex items-center gap-2">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      Product Video
                    </p>
                  </motion.div>
                </div>
              )}

              {/* Navigation Buttons - Enhanced */}
              <div className="absolute inset-0 flex justify-between items-center px-2 md:px-6 z-20">
                <motion.button
                  whileHover={{ scale: 1.15, x: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prev}
                  className="bg-black/70 backdrop-blur-xl p-1.5 md:p-2 rounded-full border border-white/20 hover:bg-black/90 hover:border-white/40 transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  <MdKeyboardArrowLeft className="text-white text-[26px] md:text-[32px]" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.15, x: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={next}
                  className="bg-black/70 backdrop-blur-xl p-1.5 md:p-2 rounded-full border border-white/20 hover:bg-black/90 hover:border-white/40 transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  <MdKeyboardArrowRight className="text-white text-[26px] md:text-[32px]" />
                </motion.button>
              </div>

              {/* Dots Navigation - Enhanced */}
              <div className="absolute bottom-2 md:bottom-6 left-0 right-0 flex justify-center items-center gap-1 md:gap-2.5 z-20">
                {product.images?.map((s, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.3 }}
                    onClick={() => setCur(index)}
                    className={`cursor-pointer transition-all duration-300 ${
                      cur === index
                        ? "md:w-12 md:h-3 h-1.5 w-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg shadow-purple-500/50"
                        : "md:w-3 md:h-3 w-1.5 h-1.5 bg-white/30 rounded-full hover:bg-white/60 backdrop-blur-sm"
                    }`}
                  />
                ))}
                {product.video_url && (
                  <motion.div
                    whileHover={{ scale: 1.3 }}
                    onClick={() => setCur(product.images?.length || 0)}
                    className={`cursor-pointer transition-all duration-300 ${
                      cur === (product.images?.length || 0)
                        ? "md:w-12 md:h-3 h-1.5 w-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-lg shadow-red-500/50"
                        : "md:w-3 md:h-3 w-1.5 h-1.5 bg-red-500/30 rounded-full hover:bg-red-500/60"
                    }`}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Product Details - Enhanced */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-start h-auto items-start px-3 lg:px-7 py-3"
          >
            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-2 md:mb-4"
            >
              <span className="inline-flex items-center gap-2 text-white/80 text-[8px] md:text-[10px] tracking-wider font-body font-medium uppercase bg-linear-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full shadow-lg">
                {product.category_name}
              </span>
            </motion.div>

            {/* Product Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full text-white mb-3 md:mb-6"
            >
              <h1 className="font-heading font-[950] text-[24px] md:text-[32px] lg:text-[38px] leading-tight text-white">
                {product.product_name}
              </h1>
            </motion.div>

            {/* Price Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full"
            >
              <div className="bg-linear-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-2xl p-4 md:px-4 md:py-2 shadow-xl">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-1">
                    <p className="font-['Poppins'] font-bold text-[14px] md:text-[20px] text-white">
                      ₹{parseInt(product.price)}
                    </p>
                    <p className="text-[8px] md:text-[10px] text-white/50 font-body">
                      {t("product_detail.tax_text")}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="font-['Poppins'] line-through text-white/30 text-[13px] md:text-[16px]">
                      ₹{parseInt(product.actual_price)}
                    </p>
                    <motion.span
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.7, type: "spring", bounce: 0.5 }}
                      className="font-['Poppins'] text-[8px] md:text-[10px] text-white bg-linear-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-sm border border-white/10 px-3 md:px-4 py-1.5 rounded-full font-bold shadow-lg"
                    >
                      {parseInt(product.discount)}
                      {t("product_detail.off_text")}
                    </motion.span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* stock */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="w-full mb-3 md:mb-5"
            >
              {/* Out of Stock */}
              {stockInfo.isOutOfStock && (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="bg-linear-to-r mt-3 from-red-500/20 to-orange-500/20 backdrop-blur-sm border-2 border-red-500/40 rounded-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-500/30 flex items-center justify-center">
                      <Package className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-red-400 font-bold text-[14px] md:text-[16px] font-body">
                        {t("product_detail.stock.out_of_stock")}
                      </p>
                      <p className="text-red-300/70 text-[10px] md:text-[12px] font-body">
                        {t("product_detail.stock.notify_text")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Low Stock Warning */}
              {stockInfo.isLowStock && (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="bg-linear-to-r mt-3 md:mt-5 from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/40 rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-500/30 flex items-center justify-center">
                        <Package className="w-5 h-5 text-yellow-400 animate-pulse" />
                      </div>
                      <div>
                        <p className="text-yellow-400 font-bold text-[13px] md:text-[15px] font-body">
                          {t("product_detail.stock.hurry_up")}
                        </p>
                        <p className="text-yellow-300/70 text-[10px] md:text-[12px] font-body">
                          {t("product_detail.stock.limited_stock")}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="bg-yellow-500/30 px-4 py-1 rounded-full border border-yellow-500/40"
                    >
                      <p className="text-yellow-400 font-bold text-[12px] md:text-[12px] font-body">
                        {stockInfo.quantity} {t("product_detail.stock.left")}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* In Stock (above 20) */}
              {/* {!stockInfo.isOutOfStock && !stockInfo.isLowStock && (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border-2 border-green-500/40 rounded-xl p-3 shadow-xl shadow-green-500/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                    <p className="text-green-400 font-bold text-[12px] md:text-[14px] font-body">
                      {t("product_detail.stock.in_stock")}
                    </p>
                  </div>
                </motion.div>
              )} */}
            </motion.div>

            {/* Similar Versions */}
            {similarProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col gap-2 md:gap-4 mb-6 w-full"
              >
                <h3 className="text-white text-[10px] md:text-[12px] tracking-wide font-body font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  {t("product_detail.choose_versions")}
                </h3>
                <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                  {similarProducts.map((item, index) => (
                    <motion.div
                      key={item.product_id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.1, type: "spring" }}
                      whileHover={{ scale: 1.15, rotate: 3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to={`/product/${item.product_id}`}
                        className="relative group block"
                      >
                        <img
                          src={getImageUrl(item.primary_image)}
                          alt={item.product_name}
                          loading="lazy"
                          className="w-[40px] h-[50px] md:w-[60px] md:h-[70px] object-cover object-center rounded-md md:rounded-2xl border md:border-2 border-white/20 group-hover:border-purple-500/70 transition-all duration-300 shadow-lg group-hover:shadow-purple-500/40"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Size Selection */}
            {product.sizes &&
              product.sizes.length > 0 &&
              product.stock_quantity > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-col gap-2 md:gap-4 mb-5 md:mb-8 w-full"
                >
                  <h3 className="text-white text-[13px] md:text-[15px] font-body tracking-wide font-medium flex items-center gap-1">
                    {t("product_detail.select_size")}
                    <AnimatePresence>
                      {selectedSize && (
                        <motion.span
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          className="text-green-400 ml-2 flex text-[10px] md:text-[15px] items-center gap-2 bg-green-500/20 px-2 md:px-3 py-1 rounded-[10px] border border-green-500/40 shadow-lg shadow-green-500/20"
                        >
                          <span className="text-[10px] md:text-[14px]">✓</span>{" "}
                          {selectedSize}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </h3>

                  <div className="flex flex-wrap items-center gap-1 md:gap-2">
                    {product.sizes.map((size, id) => (
                      <motion.button
                        key={id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: 0.8 + id * 0.1,
                          type: "spring",
                          bounce: 0.4,
                        }}
                        whileHover={{ scale: 1.1, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSizeSelect(size)}
                        className={`relative capitalize rounded-lg md:rounded-xl min-w-[40px] md:min-w-[75px] px-3 py-1.5 flex justify-center items-center font-body text-[10px] text-white md:text-[14px] font-medium transition-all duration-300 cursor-pointer overflow-hidden ${
                          selectedSize === size
                            ? "bg-green-500/20 border border-green-500/40 shadow-lg scale-110 shadow-green-700/40"
                            : "bg-linear-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-sm border border-white/10 shadow-lg"
                        }`}
                      >
                        <span className="relative z-10">{size}</span>
                      </motion.button>
                    ))}
                  </div>

                  {!selectedSize && (
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-yellow-400 text-[8px] md:text-[10px] font-body flex items-center gap-3 bg-yellow-500/10 p-2 md:px-2.5 md:py-2.5 rounded-md border border-yellow-500/30 backdrop-blur-sm shadow-lg"
                    >
                      {t("product_detail.size_warning")}
                    </motion.p>
                  )}
                </motion.div>
              )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex w-full flex-col gap-2 md:gap-4 mb-5 md:mb-8"
            >
              <motion.button
                whileHover={{ scale: canAddToCart ? 1.03 : 1 }}
                whileTap={{ scale: canAddToCart ? 0.97 : 1 }}
                onClick={() => {
                  if (stockInfo.isOutOfStock) {
                    showToast(
                      t("product_detail.stock.out_of_stock_toast"),
                      "error"
                    );
                    return;
                  }
                  handleAddToCart();
                  handleCart();
                  showToast("Item Added Successfully in Cart");
                }}
                disabled={!canAddToCart}
                className={`relative text-[12px] md:text-[15px] p-2 md:p-4 font-body rounded-lg md:rounded-xl w-full transition-all duration-300 overflow-hidden group ${
                  stockInfo.isOutOfStock
                    ? "bg-linear-to-r from-red-500/20 to-red-500/10 border-2 border-red-500/40 text-red-400 cursor-not-allowed"
                    : canAddToCart
                    ? "bg-linear-to-r from-accet/90 to-accet/20 text-white hover:shadow-2xl hover:shadow-accet/50 cursor-pointer hover:border-2 border-0 border-accet"
                    : "bg-linear-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-sm border border-white/10 text-white/60 cursor-not-allowed"
                }`}
              >
                {canAddToCart && !stockInfo.isOutOfStock && (
                  <>
                    <motion.div
                      className="absolute inset-0 bg-linear-to-r from-accet/20 to-accet/90"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-accet to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                )}

                <span className="relative z-10 flex items-center justify-center gap-3">
                  {stockInfo.isOutOfStock ? (
                    <>
                      <X className="w-4 h-4" />
                      {t("product_detail.stock.out_of_stock")}
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      {canAddToCart
                        ? t("product_detail.add_to_cart")
                        : t("product_detail.select_size_btn")}
                    </>
                  )}
                </span>
              </motion.button>

              {/* Virtual Try-On Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowTryOn(true)}
                className="relative text-[12px] md:text-[15px] text-white p-2 md:p-4 font-body rounded-lg md:rounded-2xl w-full overflow-hidden group border-2 border-purple-500/40 hover:border-purple-400 shadow-xl hover:shadow-purple-500/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-linear-to-r from-purple-600 via-pink-600 to-indigo-600 bg-size-[200%_100%] animate-gradient" />
                <motion.div className="absolute inset-0 bg-linear-to-r from-purple-500 via-pink-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <Sparkles className="w-4 h-4" />
                  {t("product_detail.virtual_try_on")}
                  <span className="text-[14px]">👗</span>
                </span>
              </motion.button>
            </motion.div>

            {/* Accordion Sections */}
            <div className="w-full flex flex-col gap-2">
              {/* Product Description */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => toggle(0)}
                  className="w-full flex justify-between items-center font-body text-[12px] md:text-[17px] text-white cursor-pointer select-none p-3 md:p-5"
                  aria-expanded={openIndex === 0}
                >
                  <span className="flex items-center gap-3 font-semibold">
                    <span className="w-2 h-2 bg-white blur-[1px] rounded-full" />
                    {t("product_detail.sections.description")}
                  </span>
                  <motion.svg
                    animate={{ rotate: openIndex === 0 ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {openIndex === 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5">
                        <ul className="space-y-4 leading-relaxed text-[10px] md:text-[14px] font-body text-white/80">
                          <li className="pl-4 border-l-2 border-purple-500/50">
                            {product.description}
                          </li>
                          {product?.washCare?.map((item, id) => (
                            <li
                              key={id}
                              className="pl-4 border-l-2 border-purple-500/30"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Item Details */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => toggle(1)}
                  className="w-full flex justify-between items-center font-body text-[12px] md:text-[17px] text-white cursor-pointer select-none p-3 md:p-5"
                  aria-expanded={openIndex === 1}
                >
                  <span className="flex items-center gap-3 font-semibold">
                    <span className="w-2 h-2 bg-white blur-[1px] rounded-full" />
                    {t("product_detail.sections.details")}
                  </span>
                  <motion.svg
                    animate={{ rotate: openIndex === 1 ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {openIndex === 1 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5">
                        <ul className="space-y-4 leading-relaxed text-[10px] md:text-[14px] font-body text-white/80">
                          <li className="pl-4 border-l-2 border-pink-500/50">
                            {product?.item_description}
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Delivery and Return */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => toggle(2)}
                  className="w-full flex justify-between items-center font-body text-[12px] md:text-[17px] text-white cursor-pointer select-none p-3 md:p-5"
                  aria-expanded={openIndex === 2}
                >
                  <span className="flex items-center gap-3 font-semibold">
                    <span className="w-2 h-2 bg-white blur-[1px] rounded-full" />
                    {t("product_detail.sections.delivery_return")}
                  </span>
                  <motion.svg
                    animate={{ rotate: openIndex === 2 ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {openIndex === 2 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-6">
                        {/* Delivery Section */}
                        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-5 rounded-xl border border-blue-500/20">
                          <h3 className="font-body text-white text-[15px] md:text-[16px] flex items-center gap-2 mb-3 font-semibold">
                            <Truck className="w-5 h-5 text-blue-400" />
                            {t("product_detail.delivery_info.title")}
                          </h3>
                          <ul className="list-disc list-inside space-y-2.5 text-[10px] md:text-[13px] leading-relaxed font-body text-white/70">
                            <li className="pl-2">
                              {t("product_detail.delivery_info.text_1")}
                            </li>
                            <li className="pl-2">
                              {t("product_detail.delivery_info.text_2")}
                            </li>
                            <li className="pl-2">
                              {t("product_detail.delivery_info.text_3")}
                            </li>
                            <li className="pl-2">
                              {t("product_detail.delivery_info.text_4")}
                            </li>
                          </ul>
                        </div>

                        {/* Return Section */}
                        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-5 rounded-xl border border-orange-500/20">
                          <h3 className="font-body text-white text-[15px] md:text-[16px] flex items-center gap-2 mb-3 font-semibold">
                            <RefreshCw className="w-5 h-5 text-orange-400" />
                            {t("product_detail.return_info.title")}
                          </h3>
                          <ul className="list-disc list-inside space-y-2.5 text-[10px] md:text-[13px] leading-relaxed font-body text-white/70">
                            <li className="pl-2">
                              {t("product_detail.return_info.text_1")}
                            </li>
                            <li className="pl-2">
                              {t("product_detail.return_info.text_2")}
                            </li>
                            <li className="pl-2">
                              {t("product_detail.return_info.text_3")}
                            </li>
                            <li className="pl-2">
                              {t("product_detail.return_info.text_4")}
                            </li>
                            <li className="pl-2">
                              {t("product_detail.return_info.text_5")}
                            </li>
                          </ul>
                        </div>

                        {/* Exceptions */}
                        <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 p-5 rounded-xl border border-red-500/20">
                          <h3 className="font-body text-white text-[15px] md:text-[16px] flex items-center gap-2 mb-3 font-semibold">
                            <X className="w-5 h-5 text-red-400" />
                            {t("product_detail.exceptions_info.title")}
                          </h3>
                          <ul className="list-disc list-inside space-y-2.5 text-[10px] md:text-[13px] leading-relaxed font-body text-white/70">
                            <li className="pl-2">
                              {t("product_detail.exceptions_info.text_1")}
                            </li>
                            <li className="pl-2">
                              {t("product_detail.exceptions_info.text_2")}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Frequently Bought Together */}
        <div className="w-[90%] mx-auto bg-linear-to-r from-white/5 via-white/20 to-white/5 backdrop-blur-sm border border-white/20 rounded-[20px] lg:rounded-[50px] shadow-xl mt-16">
          <BuyTogether />
        </div>

        {/* Reviews Section - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-[90%] md:w-[80%] lg:w-[90%] mx-auto lg:px-10 py-5 px-3"
        >
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <div>
              <h2 className="text-white font-heading text-[26px] md:text-[52px] font-[950] capitalize bg-linear-to-r from-white to-gray-400 bg-clip-text">
                {t("product_detail.reviews.title")}
              </h2>
              <p className="text-white/50 text-[12px] md:text-[15px] font-body">
                {productReviews.length} {t("product_detail.reviews.subtitle")}
              </p>
            </div>
          </div>

          {/* Display reviews */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
            {reviewsLoading ? (
              <div className="col-span-2 flex justify-center items-center py-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-14 h-14 border-4 border-purple-500 border-t-transparent rounded-full"
                />
              </div>
            ) : productReviews.length > 0 ? (
              displayedReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-linear-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-3 md:p-6"
                >
                  <div className="flex items-start gap-2 md:gap-3">
                    {/* Avatar */}
                    <div className="min-w-[40px] md:min-w-[55px]">
                      <div className="w-[35px] h-[35px] md:w-[45px] md:h-[45px] rounded-full bg-linear-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white font-bold text-[14px] md:text-[18px] shadow-xl">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="flex-1">
                      <div className="md:mb-2">
                        <p className="text-[14px] md:text-[17px] text-white font-body font-[950] uppercase">
                          {review.name}
                        </p>
                        <p className="text-[8px] md:text-[12px] font-body flex items-center gap-1 text-white/60 md:mt-1">
                          {t("product_detail.verified_buyer")}
                          <MdVerified className="text-green-400 text-[10px] md:text-[13px]" />
                        </p>
                      </div>

                      {/* Star Rating */}
                      <div className="flex items-center gap-1 my-2 md:my-3">
                        {[...Array(5)].map((_, i) => (
                          <motion.span
                            key={i}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <Star
                              className={`md:w-4 md:h-4 w-3 h-3 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-600"
                              }`}
                            />
                          </motion.span>
                        ))}
                      </div>

                      {/* Review Text */}
                      <p className="text-[12px] md:text-[16px] font-body text-white/80 leading-relaxed mb-4 italic">
                        "{review.review}"
                      </p>

                      {/* Quality Rating */}
                      {review.quality && (
                        <div className="flex items-center gap-1.5 md:gap-2.5">
                          {["Poor", "Good", "Awesome"].map((quality) => (
                            <span
                              key={quality}
                              className={`text-[8px] md:text-[12px] font-['Poppins']  rounded-full transition-all duration-300 ${
                                review.quality === quality
                                  ? "bg-linear-to-r from-white/15 via-white/60 to-white/15 text-black backdrop-blur-sm border border-white/10 shadow-lg font-semibold px-5 py-2.5"
                                  : "bg-white/5 text-white border border-white/10 px-3 py-1.5"
                              }`}
                            >
                              {quality}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-2 text-center py-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                  className="inline-block bg-linear-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-[10px]"
                >
                  <Star className="w-10 h-10 text-white/20 mx-auto mb-4" />
                  <p className="text-white/50 font-body text-[13px]">
                    {t("product_detail.no_reviews")}
                  </p>
                </motion.div>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {hasMoreReviews && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLoadMoreReviews}
                className="flex items-center gap-3 px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white transition-all cursor-pointer text-[14px] md:text-[16px] font-body font-semibold rounded-full border-2 border-white/20 shadow-xl hover:shadow-purple-500/50"
              >
                <Sparkles className="w-4 h-4" />
                Show {productReviews.length - reviewsToShow} More Reviews
              </motion.button>
            </motion.div>
          )}

          {/* Write Review Button */}
          <Link to={`/product/${id}/product-review`}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-linear-to-r from-accet/90 to-accet/20 hover:from-accet/20 hover:via-accet cursor-pointer text-[10px] md:text-[15px] text-white font-body font-bold mt-4 md:mt-8 rounded-lg md:rounded-2xl hover:border-2 border-0  border-accet/70 transition-all duration-300"
            >
              {t("product_detail.write_review_btn")}
            </motion.button>
          </Link>
        </motion.div>

        {/* The Wardrobe Hub - Enhanced */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className={`w-full mx-auto py-4 lg:py-12 ${
            product.gender === "men" ? "hidden" : "block"
          }`}
        >
          <div className="flex flex-col justify-center items-center py-7 md:py-8 md:mb-4">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[10px] md:text-[13px] text-white/60 capitalize tracking-[0.3em] leading-none font-body"
            >
              {t("product_detail.wardrobe_hub.subtitle")}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[28px] md:text-[34px] lg:text-[44px] text-center text-white capitalize tracking-wide leading-tight font-[950] font-heading bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text"
            >
              {t("product_detail.wardrobe_hub.title")}
            </motion.h2>
          </div>

          <div className="overflow-hidden relative rounded-3xl">
            <div className="flex justify-center items-center gap-5 productCard-wrapper">
              {images.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.08, rotate: 2 }}
                  className={`sareeProduct ${item.saree} relative group `}
                >
                  <img
                    src={
                      product.category === "Chudidhars" ? item.chudi : item.img
                    }
                    alt={item.saree}
                    loading="lazy"
                    className="object-cover w-[170px] min-h-[230px] max-h-[300px] md:w-[230px] md:min-h-[300px] md:max-h-[350px] object-center rounded-3xl"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Similar Products - Enhanced */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="w-full mx-auto py-5"
        >
          <div className="flex flex-col justify-center items-center mb-3">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[8px] md:text-[13px] text-white/60 uppercase tracking-[0.3em] leading-none font-body"
            >
              {t("product_detail.similar_products.subtitle")}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[28px] md:text-[34px] lg:text-[44px] text-center text-white capitalize tracking-wide leading-tight font-[950] font-heading bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text"
            >
              {t("product_detail.similar_products.title")}
            </motion.h2>
          </div>

          {similarProducts.length > 0 ? (
            <ProductSwiper products={similarProducts} />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10"
            >
              <div className="inline-block bg-linear-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-[10px]">
                <Sparkles className="w-10 h-10 mx-auto mb-4 text-white/20" />
                <p className="text-white/40 font-body text-[10px] md:text-[16px]">
                  {t("product_detail.similar_products.no_products")}
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Curated Styles - Enhanced */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="w-full mx-auto py-6"
        >
          <div className="flex flex-col gap-4 justify-center items-center md:mb-6">
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-[24px] md:text-[32px] lg:text-[44px] text-center text-white capitalize tracking-wide leading-tight font-[950] font-heading bg-linear-to-r from-white via-orange-100 to-red-100 bg-clip-text"
            >
              {t("product_detail.curated_styles.title")}
            </motion.h2>
          </div>
          <Trending />
        </motion.div>

        {/* Virtual Try-On Modal - Enhanced */}
        <AnimatePresence>
          {showTryOn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex font-body items-center justify-center p-4"
              onClick={closeTryOnModal}
            >
              <motion.div
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 50, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                className="bg-gradient-to-b from-gray-900 via-black to-gray-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border-2 border-white/20 shadow-2xl shadow-purple-500/30"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-purple-900/95 to-pink-900/95 backdrop-blur-xl p-6 border-b border-white/10 z-50 rounded-t-3xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-[22px] md:text-2xl font-heading font-bold text-white flex items-center gap-3">
                        <Sparkles className="w-7 h-7 text-purple-400" />
                        {t("product_detail.try_on_modal.title")}
                      </h2>
                      <p className="text-white/50 text-[12px] md:text-sm font-body mt-1">
                        {t("product_detail.try_on_modal.subtitle")}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ rotate: 90, scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={closeTryOnModal}
                      className="text-white/60 hover:text-white text-2xl bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all"
                    >
                      <X />
                    </motion.button>
                  </div>
                </div>

                {/* Content */}
                <div className="relative w-full h-[450px] flex justify-center items-center">
                  <DarkVeil />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.3 }}
                    className="absolute z-10 text-center px-6"
                  >
                    <Sparkles className="w-24 h-24 text-purple-400 mx-auto mb-6 animate-pulse" />
                    <p className="text-white text-[32px] md:text-[40px] font-heading font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-3">
                      {t("product_detail.try_on_modal.coming_soon")}
                    </p>
                    <p className="text-white/50 text-[15px] font-body max-w-md mx-auto">
                      {t("product_detail.try_on_modal.coming_soon_desc")}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ProductDetail;
