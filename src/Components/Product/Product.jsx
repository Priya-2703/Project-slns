import { Link } from "react-router-dom";
import UseFetchData from "../../Hooks/UseFetchData";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

const Product = () => {
  const { data,loading } = UseFetchData();
  const [search, setSearch] = useState("");

  //dropdown
  const [products, setProducts] = useState(data);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Sort By");
  const dropdownRef = useRef(null);
  const [selectedCategory, setSeletedCategory] = useState(null);

  const displayProducts = products.filter((item) => {
    const matchCategory = selectedCategory
      ? item.category_name === selectedCategory
      : true;
    const matchSearch = search
      ? item.product_name.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchCategory && matchSearch;
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

  // 🎯 Product Card Variants (Row-based delay calculation)
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

        {/* search bar */}
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
            className="bg-accet px-3 h-full py-2"
            onClick={handleSearch}
          >
            <Search color="white" size={mobileView ? 14 : 20} />
          </motion.div>
        </motion.div>
      </div>

      {/* Category & Sort Section */}
      <motion.div
        variants={itemVariants}
        className="w-[90%] mx-auto flex flex-col md:flex-row md:justify-between md:items-end lg:px-4 py-3 gap-5"
      >
        {/* Categories */}
        <div className="flex justify-center items-center gap-4 lg:gap-8">
          {categories.map((item, index) => (
            <motion.div
              key={item.name}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={categoryVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSeletedCategory(item.name)}
              className={`flex flex-col justify-center items-center cursor-pointer transition-all duration-300 ${
                selectedCategory === item.name
                  ? "scale-120 gap-1 text-accet"
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
                <img src={item.img} alt="category" loading="lazy" className="object-cover" />
              </div>
              <h1 className="text-[8px] md:text-[10px] text-center font-['Poppins']">
                {item.name}
              </h1>
            </motion.div>
          ))}
        </div>

        {/* sort by */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex relative mb-0 md:mb-2 lg:mb-0 self-end"
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

          {/* Dropdown menu */}
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

      {/* products */}
      <motion.div
        variants={itemVariants}
        className="w-[90%] mx-auto grid grid-cols-1 py-6"
      >
        {displayProducts.length == 0 ? (
          <>
            <div className="w-full flex justify-center items-center">
              <p className="text-white font-body text-[20px] font-medium">
                No product found
              </p>
            </div>
          </>
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

// 🎯 Separate Component for Product Card with useInView
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
