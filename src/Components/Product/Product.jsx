import { Link } from "react-router-dom";
import UseFetchData from "../../Hooks/UseFetchData";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { assets } from "../../../public/assets/asset";
import axios from "axios";

const categories = [
  {
    name: "Sarees",
    img: "https://framerusercontent.com/images/Q0ih86EcQhWKKGCX5VU05ql9c.jpg",
  },
  {
    name: "Half Sarees",
    img: "https://framerusercontent.com/images/kw9cJ8cAr3HMqNCZMrzald2zdH4.jpg",
  },
  {
    name: "Chudidhars",
    img: "https://framerusercontent.com/images/Wa9VEYx9s6XaxR5umPBFrfvfyY.jpg",
  },
  {
    name: "Mens Dhosti's",
    img: "https://framerusercontent.com/images/xWh57g9CWUCZz6Uf9bKYhaOKmg.jpg",
  },
  {
    name: "Kids Dhosti's",
    img: "https://framerusercontent.com/images/flRrM6HvTySSlzWRjQ26HxK6M.jpg",
  },
];

const banners = [
  {
    id: 1,
    title: "New Collection 2026",
    subtitle: "Exclusive Designer Sarees",
    description: "Up to 50% OFF",
    image: "https://framerusercontent.com/images/Q0ih86EcQhWKKGCX5VU05ql9c.jpg",
    bgGradient: "from-purple-600/30 via-pink-600/30 to-red-600/30",
  },
  {
    id: 2,
    title: "Traditional Elegance",
    subtitle: "Premium Half Sarees",
    description: "Shop Now & Save Big",
    image:
      "https://i.pinimg.com/1200x/e9/f4/95/e9f495c0fa12709a31d5350bea2f0b68.jpg",
    bgGradient: "from-blue-600/30 via-cyan-600/30 to-teal-600/30",
  },
  {
    id: 3,
    title: "Festive Special",
    subtitle: "Designer Chudidhars",
    description: "Limited Time Offer",
    image:
      "https://framerusercontent.com/images/Wa9VEYx9s6XaxR5umPBFrfvfyY.jpg",
    bgGradient: "from-orange-600/30 via-amber-600/30 to-yellow-600/30",
  },
  {
    id: 4,
    title: "Men's Collection",
    subtitle: "Classic Dhosti's",
    description: "Best Deals Inside",
    image: assets.dhostiBanner,
    bgGradient: "from-green-600/30 via-emerald-600/30 to-lime-600/30",
  },
];

// 🎯 Banner Carousel Component
const BannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="w-[90%] mx-auto relative overflow-hidden rounded-2xl h-[200px] md:h-[280px] lg:h-[350px] group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 },
          }}
          className="absolute w-full h-full"
        >
          <div className="absolute inset-0">
            <img
              src={banners[currentIndex].image}
              alt={banners[currentIndex].title}
              className="w-full h-full object-cover"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-r ${banners[currentIndex].bgGradient} backdrop-blur-[2px]`}
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative h-full flex items-center px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-2xl"
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-white/90 text-[10px] md:text-sm lg:text-base font-['Poppins'] tracking-wider mb-2"
              >
                {banners[currentIndex].subtitle}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-white text-2xl md:text-4xl lg:text-6xl font-bold font-heading mb-2 md:mb-4 drop-shadow-lg"
              >
                {banners[currentIndex].title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-white text-sm md:text-xl lg:text-2xl font-semibold font-['Poppins'] mb-4 md:mb-6"
              >
                {banners[currentIndex].description}
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
      >
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-white" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1, x: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
      >
        <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-white" />
      </motion.button>

      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-10">
        {banners.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="relative group"
          >
            <motion.div
              initial={false}
              animate={{
                scale: currentIndex === index ? 1 : 0,
                opacity: currentIndex === index ? 1 : 0,
              }}
              className="absolute inset-0 rounded-full border-2 border-accet -m-1"
            />

            <motion.div
              initial={false}
              animate={{
                width: currentIndex === index ? "32px" : "8px",
                backgroundColor:
                  currentIndex === index ? "#955E30" : "rgba(255,255,255,0.5)",
              }}
              transition={{ duration: 0.3 }}
              className="h-2 rounded-full"
            />

            {currentIndex === index && !isPaused && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 3, ease: "linear" }}
                className="absolute top-0 left-0 h-full bg-white rounded-full origin-left"
              />
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full z-10"
          >
            <p className="text-white text-[10px] md:text-xs font-['Poppins']">
              Paused
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Product = () => {
  const BACKEND_URL = import.meta.env.VITE_API_URL;
  const { data, loading } = UseFetchData();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Sort By");
  const dropdownRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 🎯 NEW: Subcategory states
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [visibleSubcategories, setVisibleSubcategories] = useState(15);
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  useEffect(() => {
    document.title = `Shop Now - SLNS Sarees`;
  }, []);

  // 🎯 NEW: Fetch subcategories from backend
  const fetchSubcategories = async () => {
    setLoadingSubcategories(true);
    try {
      // Replace with your actual API endpoint
      const response = await axios.get(`${BACKEND_URL}/api/subcategories`);
      const subCat = response.data;
      setSubcategories(subCat.subcategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]);
    } finally {
      setLoadingSubcategories(false);
    }
  };

  // 🔄 Filter products
  const displayProducts = products.filter((item) => {
    const matchCategory = selectedCategory
      ? item.category_name === selectedCategory
      : true;

    // 🎯 NEW: Filter by subcategory
    const matchSubcategory = selectedSubcategory
      ? item.sub_category === selectedSubcategory ||
        item.saree_type === selectedSubcategory ||
        item.product_type === selectedSubcategory
      : true;

    const matchSearch = search
      ? item.product_name.toLowerCase().includes(search.toLowerCase())
      : true;

    return matchSearch && matchCategory && matchSubcategory;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setProducts(data);
  };

  const clearSearch = () => {
    setSearch("");
  };

  useEffect(() => {
    setProducts(data);
  }, [data]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSort = (option) => {
    let sorted = [...products];
    switch (option) {
      case "Price: Low to High":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "Price: High to Low":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "Name: A - Z":
        sorted.sort((a, b) => a.product_name.localeCompare(b.product_name));
        break;
      case "Name: Z - A":
        sorted.sort((a, b) => b.product_name.localeCompare(a.product_name));
        break;
      default:
        sorted = data;
    }
    setProducts(sorted);
    setSelected(option);
    setIsOpen(false);
  };

  // 🎯 NEW: Handle category click
  const handleCategoryClick = async (categoryName) => {
    if (categoryName === "Sarees") {
      if (selectedCategory === "Sarees") {
        // Toggle subcategories
        setShowSubcategories(!showSubcategories);
      } else {
        // Set new category and fetch subcategories
        setSelectedCategory(categoryName);
        setShowSubcategories(true);
        setSelectedSubcategory(null);
        setVisibleSubcategories(15);
        await fetchSubcategories(categoryName);
      }
    } else {
      // For other categories, hide subcategories
      setSelectedCategory(categoryName);
      setShowSubcategories(false);
      setSelectedSubcategory(null);
      setSubcategories([]);
      setVisibleSubcategories(15);
    }
  };

  // 🎯 NEW: Handle subcategory click
  const handleSubcategoryClick = (subcategory) => {
    if (selectedSubcategory === subcategory) {
      setSelectedSubcategory(null);
    } else {
      setSelectedSubcategory(subcategory);
    }
  };
  // 🎯 NEW: Load more subcategories
  const loadMoreSubcategories = () => {
    setVisibleSubcategories((prev) => prev + 10);
  };

  const options = [
    "Price: Low to High",
    "Price: High to Low",
    "Name: A - Z",
    "Name: Z - A",
  ];

  const mobileView = window.innerWidth < 480;

  // 🎨 Animation Variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const searchBarVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const categoryVariants = {
    hidden: { opacity: 0, scale: 0.5, y: 20 },
    visible: (index) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  // 🎯 NEW: Subcategory animation variants
  // const subcategoryContainerVariants = {
  //   hidden: {
  //     opacity: 0,
  //     height: 0,
  //     marginTop: 0,
  //   },
  //   visible: {
  //     opacity: 1,
  //     height: "auto",
  //     marginTop: 20,
  //     transition: {
  //       duration: 0.5,
  //       ease: [0.22, 1, 0.36, 1],
  //       staggerChildren: 0.03,
  //       delayChildren: 0.1,
  //     },
  //   },
  //   exit: {
  //     opacity: 0,
  //     height: 0,
  //     marginTop: 0,
  //     transition: {
  //       duration: 0.4,
  //       ease: [0.22, 1, 0.36, 1],
  //     },
  //   },
  // };

  // const subcategoryItemVariants = {
  //   hidden: {
  //     opacity: 0,
  //     y: -10,
  //     scale: 0.8,
  //   },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     scale: 1,
  //     transition: {
  //       duration: 0.3,
  //       ease: [0.22, 1, 0.36, 1],
  //     },
  //   },
  // };

  const getColumnDelay = (index) => {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    let columns = 5;
    if (isMobile) columns = 2;
    else if (isTablet) columns = 3;

    const columnPosition = index % columns;
    return columnPosition * 0.05;
  };

  const productCardVariants = {
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
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
      },
    }),
    exit: {
      opacity: 0,
      scale: 0.7,
      y: -30,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="w-full mx-auto py-6 mt-16 md:mt-28"
    >
      <div className="mb-6">
        <BannerCarousel />
      </div>

      {/* Breadcrumb & Search Bar */}
      <div className="w-[90%] flex justify-between items-center mx-auto mt-4 py-3">
        <motion.div
          variants={itemVariants}
          className="flex justify-start items-start"
        >
          <p className="text-white font-body text-[10px] md:text-[12px] tracking-wide font2">
            <Link to={"/"} className="text-white/80 hover:text-white">
              Home
            </Link>{" "}
            / Product
          </p>
        </motion.div>

        <motion.div
          variants={searchBarVariants}
          className="flex justify-center items-center w-[200px] md:w-[300px] gap-1 md:gap-4 border border-accet overflow-hidden rounded-l-full"
        >
          <div className="flex justify-center items-center relative px-2 ">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch(e);
              }}
              className="bg-transparent px-2 py-1 w-full text-[11px] md:text-[13px] font-['Poppins'] capitalize text-white placeholder:text-gray-700 outline-none"
              placeholder="Search product..."
            />
            <AnimatePresence>
              {search && (
                <motion.button
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  onClick={clearSearch}
                  className="absolute right-0 md:-right-3"
                >
                  <X color="white" size={mobileView ? 14 : 20} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-accet px-3 h-full py-2 cursor-pointer"
            onClick={handleSearch}
          >
            <Search color="white" size={mobileView ? 14 : 20} />
          </motion.div>
        </motion.div>
      </div>

      {/* Category & Subcategory Section */}
      <motion.div
        variants={itemVariants}
        className="w-[90%] mx-auto flex flex-col md:flex-row md:justify-between md:items-start lg:px-4 py-3 gap-5"
      >
        <div className="flex-1">
          {/* Categories */}
          <div className="flex justify-center md:justify-start items-center gap-4 lg:gap-8">
            {categories.map((item, index) => (
              <motion.div
                key={item.name}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={categoryVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryClick(item.name)}
                className={`flex flex-col justify-center items-center cursor-pointer transition-all duration-300 ${
                  selectedCategory === item.name
                    ? "scale-110 gap-1 text-accet"
                    : "scale-100 gap-2 text-white"
                }`}
              >
                <div
                  className={`md:w-[70px] w-[50px] h-[50px] md:h-[70px] rounded-full border-2 border-white/5 overflow-hidden transition-transform duration-300 ${
                    selectedCategory === item.name
                      ? "drop-shadow-[0px_0px_20px] drop-shadow-accet"
                      : "drop-shadow-[0px_0px_0px] drop-shadow-accet"
                  }`}
                >
                  <img
                    src={item.img}
                    alt="category"
                    loading="lazy"
                    className="object-cover w-full h-full"
                  />
                </div>
                <h1 className="text-[8px] md:text-[10px] text-center font-['Poppins']">
                  {item.name}
                </h1>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex relative self-end md:self-start"
          ref={dropdownRef}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 md:px-5 py-1.5 md:py-2 border border-accet rounded-full shadow-sm hover:bg-accet transition duration-300"
          >
            <span className="text-white font-['Poppins'] text-[8px] md:text-[12px] font-normal">
              {selected}
            </span>
            <motion.svg
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              xmlns="http://www.w3.org/2000/svg"
              className="md:w-4 md:h-4 w-3 h-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </motion.svg>
          </motion.button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.9 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="absolute z-30 top-[45px] text-[8px] md:text-[12px] text-white font-['Poppins'] right-0 w-[150px] md:w-[200px] flex justify-center items-center flex-col bg-black border border-accet rounded-lg shadow-lg overflow-hidden"
              >
                {options.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.3 }}
                    whileHover={{
                      backgroundColor: "rgba(149, 94, 48, 0.5)",
                      x: 0,
                    }}
                    onClick={() => handleSort(option)}
                    className="w-full px-4 py-3 text-white text-center cursor-pointer transition-all duration-200"
                  >
                    {option}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* 🎯 NEW: Subcategories Section */}
      <AnimatePresence mode="wait">
        {selectedCategory === "Sarees" && showSubcategories && (
          <motion.div
            // variants={subcategoryContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-[90%] mx-auto py-1"
          >
            {loadingSubcategories ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center py-4"
              >
                <div className="w-6 h-6 border-2 border-accet border-t-transparent rounded-full animate-spin" />
              </motion.div>
            ) : (
              <>
                <div className="w-full flex flex-wrap gap-1">
                  {subcategories
                    .slice(0, visibleSubcategories)
                    .map((subcategory, index) => (
                      <motion.button
                        key={`${subcategory}-${index}`}
                        custom={index}
                        // variants={subcategoryItemVariants}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSubcategoryClick(subcategory)}
                        className={`px-2 md:px-3 py-1.5 rounded-full text-[10px] md:text-[12px] font-body transition-all duration-300 ${
                          selectedSubcategory === subcategory
                            ? "bg-accet text-white shadow-lg shadow-accet/50"
                            : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                        }`}
                      >
                        {subcategory}
                      </motion.button>
                    ))}

                  {/* More Button */}
                  {visibleSubcategories < subcategories.length && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={loadMoreSubcategories}
                      className="px-2 md:px-3 py-1.5 bg-accet/20 hover:bg-accet/30 border border-accet rounded-full text-white text-[10px] md:text-[12px] font-['Poppins'] transition-all duration-300"
                    >
                      More ({subcategories.length - visibleSubcategories})...
                    </motion.button>
                  )}

                  {/* show less */}
                  {visibleSubcategories > 15 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setVisibleSubcategories(15)}
                      className="px-2 md:px-3 py-1.5 bg-accet/20 hover:bg-accet/30 border border-accet rounded-full text-white text-[10px] md:text-[12px] font-['Poppins'] transition-all duration-300"
                    >
                      Show Less
                    </motion.button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products */}
      <motion.div
        variants={itemVariants}
        className="w-[90%] mx-auto grid grid-cols-1 py-6"
      >
        {displayProducts.length === 0 ? (
          <div className="w-full flex justify-center items-center py-20">
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-white font-body text-[16px] md:text-[20px] font-medium"
            >
              No product found
            </motion.p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-5 md:gap-4 justify-items-center"
          >
            <AnimatePresence mode="popLayout">
              {displayProducts.map((item, index) => (
                <ProductCardWrapper
                  key={item.product_id}
                  item={item}
                  index={index}
                  variants={productCardVariants}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

const ProductCardWrapper = ({ item, index, variants }) => {
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
      whileHover={{
        y: -8,
        transition: { duration: 0.3 },
      }}
    >
      <ProductCard product={item} />
    </motion.div>
  );
};

export default Product;
