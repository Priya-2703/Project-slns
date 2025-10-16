import {
  CircleUserRound,
  Search,
  SearchCheck,
  ShoppingCart,
  X,
} from "lucide-react";
import { FaHeart } from "react-icons/fa";
import { assets } from "../../../public/assets/asset";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoSearch } from "react-icons/io5";

const Navbar = () => {
  const [productOpen, setProductOpen] = useState(false); // dropdown
  const [showCard, setShowCard] = useState(false); // profile card
  const [menuOpen, setMenuOpen] = useState(false); // side menu
  const [search, setSearch] = useState(false); // side menu
  const cardRef = useRef(null);
  const signRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false); // any navigation -> close menu
  }, [location.pathname]);

  // Close profile card when clicking outside (mousemove -> mousedown for perf)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        cardRef.current &&
        !cardRef.current.contains(e.target) &&
        !signRef.current?.contains(e.target)
      ) {
        setShowCard(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Optional: ESC to close menu/profile
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setShowCard(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <div className="fixed w-full top-0 mx-auto py-1 md:py-4 px-5 md:px-10 z-40">
        <div className="flex justify-between items-center md:px-6">
          <div>
            <img
              src={assets.logo}
              alt="logo"
              className="w-[70px] md:w-[80px] cursor-pointer select-none"
              onClick={() => setMenuOpen(true)} // Logo click -> open menu
            />
          </div>

          <div className="flex justify-center items-center gap-8 md:gap-16">
            <span>
              <Search
                onClick={() => setSearch((q) => !q)}
                strokeWidth={1.5}
                size={20}
                color="#955E30"
                className="nav-item"
              />
            </span>
            <Link to={"/cart"}>
              <span>
                <ShoppingCart
                  size={20}
                  strokeWidth={1.5}
                  color="#955E30"
                  className="nav-item"
                />
              </span>
            </Link>
            <span
              ref={signRef}
              className="relative signin"
              onMouseEnter={() => setShowCard(true)}
              onClick={() => setShowCard(true)}
            >
              <CircleUserRound
                size={20}
                strokeWidth={1.5}
                color="#955E30"
                className="nav-item"
              />
              <div
                ref={cardRef}
                className={`absolute top-[30px] right-[-3px] w-[160px] glass-card py-2 px-1 rounded-[14px] transition-all duration-300 ${
                  showCard
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <div className="flex flex-col justify-center items-center gap-1">
                  <a
                    href="/"
                    className="w-full bg-black/50 px-5 py-1.5 rounded-[10px]"
                  >
                    <p className="text-white/60 flex justify-center items-center gap-2 text-[14px]">
                      <FaHeart className="text-white/60 text-[14px]" /> Wishlist
                    </p>
                  </a>
                  <Link to={"/signin"}
                    className="w-full bg-black/50 px-5 py-1.5 rounded-[10px]"
                  >
                    <p className="text-white/60 flex justify-center items-center gap-2 text-[14px]">
                      Sign In
                    </p>
                  </Link>
                  <Link to={"/b2b-signin"}
                    className="w-full bg-black/50 px-5 py-1.5 rounded-[10px]"
                  >
                    <p className="text-white/60 flex justify-center items-center gap-2 text-[14px]">
                      <FaHeart className="text-white/60 text-[12px]" /> B 2 B{" "}
                    </p>
                  </Link>
                  <span className="bg-white/20 w-full h-[1px] my-1"></span>
                  <Link
                    to={"/"}
                    className="w-full bg-black/50 px-5 py-1.5 rounded-[10px]"
                  >
                    <p className="text-white/60 flex justify-center items-center gap-2 text-[14px]">
                      <FaCircleArrowLeft className="text-white/60 text-[15px]" />{" "}
                      Sign Out
                    </p>
                  </Link>
                </div>
              </div>
            </span>
          </div>
        </div>
      </div>

      {/* Optional overlay: outside click -> close menu */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Side Menu (slides from left) */}
      <div
        className={`fixed z-50 left-0 top-[100px] w-[330px] h-auto px-8 py-8 rounded-r-[20px] bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 bg-white/5 justify-center overflow-hidden transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex flex-col gap-16">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font2-medium text-[16px] tracking-wide uppercase text-white">
                Menu
              </h1>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="p-1 rounded hover:bg-white/10 active:scale-95 transition"
            >
              <X color="white" />
            </button>
          </div>

          <div className="w-[100%] flex flex-col justify-center gap-10">
            <Link to={"/"}>
              <p className="font-['Poppins'] text-[16px] tracking-wide uppercase text-white">
                Home
              </p>
            </Link>
            <Link to={"/about"}>
              <p className="font-['Poppins'] text-[16px] tracking-wide uppercase text-white">
                About Us
              </p>
            </Link>

            {/* Product + Dropdown */}
            <div className="w-full mb-[-15px]">
              <button
                type="button"
                onClick={() => setProductOpen((o) => !o)}
                className="w-full flex justify-between items-center font-['Poppins'] text-[16px] tracking-wide uppercase text-white cursor-pointer select-none"
                aria-expanded={productOpen}
                aria-controls="product-menu"
              >
                Product
                <svg
                  className={`h-6 w-6 transition-transform duration-300 ${
                    productOpen ? "rotate-180" : ""
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
                id="product-menu"
                className={`pl-4 mt-3 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                  productOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <ul className="flex flex-col gap-3">
                  <li className="border-b-[1px] pb-3 px-2 border-white/20">
                    <a className="font2-bold text-[13px] tracking-wide text-white/90 hover:text-white transition-colors cursor-pointer">
                      Sarees
                    </a>
                  </li>
                  <li className="border-b-[1px] pb-3 px-2 border-white/20">
                    <a className="font2-bold text-[13px] tracking-wide text-white/90 hover:text-white transition-colors cursor-pointer">
                      Half sarees
                    </a>
                  </li>
                  <li className="border-b-[1px] pb-3 px-2 border-white/20">
                    <a className="font2-bold text-[13px] tracking-wide text-white/90 hover:text-white transition-colors cursor-pointer">
                      Chudidhars
                    </a>
                  </li>
                  <li className="border-b-[1px] pb-3 px-2 border-white/20">
                    <a className="font2-bold text-[13px] tracking-wide text-white/90 hover:text-white transition-colors cursor-pointer">
                      Dhotis & Shirts for Mens
                    </a>
                  </li>
                  <li className="border-b-[1px] pb-4 px-2 border-white/20">
                    <a className="font2-bold text-[13px] tracking-wide text-white/90 hover:text-white transition-colors cursor-pointer">
                      Dhotis & Shirts for Kids
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <p className="font-['Poppins'] text-[16px] tracking-wide uppercase text-white">
              Wishlist
            </p>
            <p className="font-['Poppins'] text-[16px] tracking-wide uppercase text-white">
              profile
            </p>
            <Link to={"/faq"}>
              <p className="font-['Poppins'] text-[16px] tracking-wide uppercase text-white">
                FAQ
              </p>
            </Link>
            <Link to={"/contact"}>
              <p className="font-['Poppins'] text-[16px] tracking-wide uppercase text-white">
                Contact
              </p>
            </Link>
          </div>
        </div>
      </div>

      {/* search page */}

      {/* Search Overlay (slides from left) */}
      <div
        className={`fixed top-0 left-0 h-screen w-full bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          search
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSearch(false)} // click outside -> close
      >
        <div
          className={`absolute top-0 left-0 h-screen w-[350px] bg-black p-6 shadow-xl rounded-r-2xl transform transition-transform duration-500 ease-in-out ${
            search ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()} // stop closing when clicking inside
        >
          <div className="flex justify-center items-center mb-6 gap-2 px-3">
            <div><IoSearch className="text-white text-[20px]" /></div>
            <input
              type="text"
              placeholder="Search..."
              className='bg-transparent outline-none focus:outline-none text-white font-["Poppins"]  text-[16px]'
            />
          </div>

          {/* Optional — search results area */}
          <div className="mt-6 text-white text-sm">
            Start typing to see results...
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
