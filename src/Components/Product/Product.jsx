import { Link } from "react-router-dom";
import UseFetchData from "../../Hooks/UseFetchData";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "framer-motion";
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
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // 🔄 CHANGED: Fetch from database with category and search filters
  const { data, loading, error } = UseFetchData(selectedCategory, null);
  
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Sort By");
  const dropdownRef = useRef(null);

  // 🔄 CHANGED: Filter products locally for search
  const displayProducts = products.filter((item) => {
    const matchSearch = search
      ? item.name.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchSearch;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by displayProducts filter
  };

  const clearSearch = () => {
    setSearch("");
  };

  // 🆕 NEW: Update products when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      setProducts(data);
    }
  }, [data]);

  // Close dropdown if clicked outside
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
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Name: Z - A":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
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

  return (
    <>
      <div className="w-full mx-auto py-6 mt-16 md:mt-28">
        <div className="w-[90%] flex justify-between items-center mx-auto mt-4 py-3">
          <div className="flex justify-start items-start">
            <p className="text-white text-[10px] md:text-[12px] tracking-wide font2">
              <Link to={"/"} className="text-white/80 hover:text-white">
                Home
              </Link>{" "}
              / Product
            </p>
          </div>

          {/* search bar */}
          <div className="flex justify-center items-center w-[200px] md:w-[300px] gap-1 md:gap-4 border border-[#955E30] overflow-hidden rounded-l-full">
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
              {search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-0 md:-right-3"
                >
                  <X color="white" size={mobileView ? 14 : 20} />
                </button>
              )}
            </div>
            <div
              className="bg-[#955E30] px-3 h-full py-2 cursor-pointer"
              onClick={handleSearch}
            >
              <Search color="white" size={mobileView ? 14 : 20} />
            </div>
          </div>
        </div>

        {/* category */}
        <div className="w-[90%] mx-auto flex flex-col md:flex-row md:justify-between md:items-end lg:px-4 py-3 gap-5">
          {/* Categories */}
          <div className="flex justify-center items-center gap-4 lg:gap-8">
            {/* 🆕 NEW: Add "All" category */}
            <div
              onClick={() => setSelectedCategory(null)}
              className={`flex flex-col justify-center items-center cursor-pointer transition-all duration-300 ${
                selectedCategory === null
                  ? "scale-120 gap-1 text-[#955E30]"
                  : "scale-100 gap-2 text-white"
              }`}
            >
              <div
                className={`md:w-[70px] w-[50px] h-[50px] md:h-[70px] rounded-full border-2 border-white/5 overflow-hidden transition-transform duration-300 flex items-center justify-center bg-[#955E30]/20 ${
                  selectedCategory === null
                    ? "drop-shadow-[0px_0px_20px] drop-shadow-[#955E30]"
                    : "drop-shadow-[0px_0px_0px] drop-shadow-[#955E30]"
                }`}
              >
                <span className="text-white text-xl font-bold">All</span>
              </div>
              <h1 className="text-[8px] md:text-[10px] text-center font-['Poppins']">
                All Products
              </h1>
            </div>

            {categories.map((item, index) => (
              <div
                key={index}
                onClick={() => setSelectedCategory(item.name)}
                className={`flex flex-col justify-center items-center cursor-pointer transition-all duration-300 ${
                  selectedCategory === item.name
                    ? "scale-120 gap-1 text-[#955E30]"
                    : "scale-100 gap-2 text-white"
                }`}
              >
                <div
                  className={`md:w-[70px] w-[50px] h-[50px] md:h-[70px] rounded-full border-2 border-white/5 overflow-hidden transition-transform duration-300 ${
                    selectedCategory === item.name
                      ? "drop-shadow-[0px_0px_20px] drop-shadow-[#955E30]"
                      : "drop-shadow-[0px_0px_0px] drop-shadow-[#955E30]"
                  }`}
                >
                  <img
                    src={item.img}
                    alt="category"
                    className="object-cover w-full h-full"
                  />
                </div>
                <h1 className="text-[8px] md:text-[10px] text-center font-['Poppins']">
                  {item.name}
                </h1>
              </div>
            ))}
          </div>

          {/* sort by */}
          <div className="flex relative mb-0 md:mb-2 lg:mb-0" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-3 md:px-5 py-1.5 md:py-2 border border-[#955E30] rounded-full shadow-sm hover:bg-[#955E30] transition duration-300"
            >
              <span className="text-white font-['Poppins'] text-[8px] md:text-[12px] font-normal">
                {selected}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`md:w-4 md:h-4 w-3 h-3 transition-transform text-white duration-200 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
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
              </svg>
            </button>

            {/* Dropdown menu */}
            {isOpen && (
              <div className="absolute z-30 top-[45px] text-[8px] md:text-[12px] text-white font-['Poppins'] right-0 w-[150px] md:w-[200px] flex justify-center items-center flex-col bg-black border border-[#955E30] rounded-lg shadow-lg overflow-hidden animate-fadeIn">
                {options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleSort(option)}
                    className="w-full px-4 py-3 text-white text-center hover:bg-[#955E30] cursor-pointer transition-all duration-200"
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 🆕 NEW: Loading State */}
        {loading && (
          <div className="w-[90%] mx-auto py-20 text-center">
            <div className="text-white text-xl font2">Loading products...</div>
          </div>
        )}

        {/* 🆕 NEW: Error State */}
        {error && (
          <div className="w-[90%] mx-auto py-20 text-center">
            <div className="text-red-500 text-xl font2">
              Failed to load products. Please try again.
            </div>
          </div>
        )}

        {/* 🆕 NEW: No Products State */}
        {!loading && !error && displayProducts.length === 0 && (
          <div className="w-[90%] mx-auto py-20 text-center">
            <div className="text-white text-xl font2">
              No products found. Try a different search or category.
            </div>
          </div>
        )}

        {/* products */}
        {!loading && !error && displayProducts.length > 0 && (
          <div className="w-[90%] mx-auto grid grid-cols-1 py-6">
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-5 md:gap-4"
            >
              <AnimatePresence>
                {displayProducts.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{
                      opacity: 0,
                      scale: 0.8,
                      y: Math.random() * 100 - 50,
                      x: Math.random() * 100 - 50,
                    }}
                    animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      stiffness: 120,
                      damping: 7,
                      duration: 0.4,
                    }}
                  >
                    <ProductCard product={item} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default Product;