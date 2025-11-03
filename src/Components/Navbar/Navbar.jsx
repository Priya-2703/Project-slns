import { CircleUserRound, ShoppingCart, X } from "lucide-react";
import { assets } from "../../../public/assets/asset";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoBusiness } from "react-icons/io5";
import { CartContext } from "../../Context/UseCartContext";
import { GoHeart } from "react-icons/go";
import { WishlistContext } from "../../Context/UseWishListContext";

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const [showCard, setShowCard] = useState(false); // profile card
  const [menuOpen, setMenuOpen] = useState(false); // side menu
  const cardRef = useRef(null);
  const signRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // ⭐ NEW: Track user login status and role
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ⭐ NEW: Check login status on component mount and when location changes
  useEffect(() => {
    checkLoginStatus();
  }, [location.pathname]);

  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Error parsing user data:", err);
        setUser(null);
        setIsLoggedIn(false);
      }
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  // ⭐ NEW: Logout function
  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Update state
    setUser(null);
    setIsLoggedIn(false);
    setShowCard(false);
    setMenuOpen(false);

    // Redirect to home
    navigate("/");

    // Optional: Show success message
    // You can use your toast context here if you have one
    console.log("Logged out successfully");
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

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

  const mobileView = window.innerWidth < 480;

  // ⭐ NEW: Admin menu items
  const adminMenuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/products", label: "View Products", icon: "📦" },
    { path: "/admin/products/add", label: "Add Product", icon: "➕" },
    { path: "/admin/categories", label: "Manage Categories", icon: "🏷️" },
    { path: "/admin/import", label: "Bulk Import", icon: "📥" },
    { path: "/admin/orders", label: "Order Management", icon: "🛒" },
    { path: "/admin/customers", label: "Customer Management", icon: "👥" },
  ];

  // ⭐ NEW: Regular user menu items
  const userMenuItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/product", label: "Product" },
    { path: "/wishlist", label: "Wishlist" },
    { path: "/profile", label: "Profile" },
    { path: "/faq", label: "FAQ" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <>
      <div className="absolute top-0 w-full mx-auto py-1 md:py-4 px-5 lg:px-10 z-50 bg-transparent">
        <div className="flex justify-between items-center md:px-6">
          <div>
            <img
              src={assets.logo}
              alt="logo"
              loading="lazy"
              data-cursor-scale
              className="w-[60px] md:w-[80px] cursor-pointer select-none"
              onClick={() => setMenuOpen(true)}
            />
          </div>

          <div className="flex justify-center items-center gap-8 md:gap-16">
            {/* ⭐ UPDATED: Hide wishlist and cart for admin */}
            {user?.role !== "admin" && (
              <>
                <Link to={"/wishlist"}>
                  <div className="relative">
                    <span>
                      <GoHeart
                        size={mobileView ? 16 : 20}
                        color="#955E30"
                        className="nav-item"
                      />
                    </span>
                    {wishlist.length > 0 && (
                      <span className="absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-[#955E30] text-white text-[10px] md:text-[12px] font-semibold rounded-full w-4 h-4 md:w-5 md:h-5 flex justify-center items-center">
                        {wishlist.length}
                      </span>
                    )}
                  </div>
                </Link>
                <Link to={"/cart"}>
                  <div className="flex items-center relative gap-2">
                    <span>
                      <ShoppingCart
                        size={mobileView ? 16 : 20}
                        strokeWidth={1.5}
                        color="#955E30"
                        className="nav-item"
                      />
                    </span>
                    {cart.length > 0 && (
                      <span className="absolute -top-3 -right-3 md:-top-4 md:-right-4  bg-accet text-white text-[10px] md:text-[12px] font-semibold rounded-full w-4 h-4 md:w-5 md:h-5 flex justify-center items-center">
                        {cart.length}
                      </span>
                    )}
                  </div>
                </Link>
              </>
            )}

            {/* ⭐ UPDATED: Show admin badge for admin users */}
            {user?.role === "admin" && (
              <div className="hidden md:flex items-center gap-2 bg-[#955E30] px-3 py-1 rounded-full">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
                <span className="text-white text-xs font2">Admin</span>
              </div>
            )}

            <span
              ref={signRef}
              className="relative signin"
              onMouseEnter={() => setShowCard(true)}
              onClick={() => setShowCard(true)}
            >
              <CircleUserRound
                size={mobileView ? 16 : 20}
                strokeWidth={1.5}
                color="#955E30"
                className="nav-item"
              />

              {/* ⭐ UPDATED: Profile dropdown */}
              <div
                ref={cardRef}
                className={`absolute top-[30px] z-50 font-['Poppins'] right-[-3px] w-[120px] md:w-[160px] glass-card py-2 px-1 rounded-[14px] transition-all duration-300 ${
                  showCard
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <div className="flex flex-col justify-center items-center gap-1">
                  {/* ⭐ NEW: Show user info if logged in */}
                  {isLoggedIn && user && (
                    <div className="w-full  px-3 py-2 mb-2">
                      <Link to={"/profile"} className=" flex items-center gap-2 text-white hover:text-white/60 transition-all duration-200">
                        <div>
                          <CircleUserRound
                            size={mobileView ? 16 : 24}
                            strokeWidth={1.5}
                            color="white"
                            className="nav-item hover:text-white/60"
                          />
                        </div>
                        <div className="flex flex-col justify-center items-start">
                          <p className=" text-xs capitalize font-body font-semibold">
                            {user.name}
                          </p>
                          <p className=" text-[10px] font-body">
                            {user.email}
                          </p>
                        </div>
                      </Link>
                      {user.role === "admin" && (
                        <span className="inline-block mt-1 bg-[#955E30] capitalize font-body text-white text-[9px] px-2 py-0.5 rounded-full">
                          Admin
                        </span>
                      )}
                    </div>
                  )}

                  {/* ⭐ UPDATED: Show sign in/out based on login status */}
                  {!isLoggedIn ? (
                    <>
                      <Link
                        to={"/signin"}
                        className="w-full bg-black/50 px-5 py-1.5 rounded-[10px]"
                        onClick={() => setShowCard(false)}
                      >
                        <p className="text-white/60 hover:text-white transition-all duration-200 flex justify-center items-center gap-2 text-[12px] md:text-[14px]">
                          Sign In
                        </p>
                      </Link>
                      <Link
                        to={"/b2b-signin"}
                        className="w-full bg-black/50 px-5 py-1.5 rounded-[10px]"
                        onClick={() => setShowCard(false)}
                      >
                        <p className="ext-white/60 hover:text-white transition-all duration-200 flex justify-center items-center gap-2 text-[12px] md:text-[14px]">
                          <IoBusiness className="text-[11px] md:text-[12px]" />{" "}
                          B 2 B
                        </p>
                      </Link>
                    </>
                  ) : (
                    <>
                      <span className="bg-white/20 w-full h-px mb-1"></span>
                      <button
                        onClick={handleLogout}
                        className="w-full bg-black/50 text-white/60 hover:bg-[#bb5e00] hover:text-white transition-all duration-200 px-5 py-1.5 rounded-[10px]"
                      >
                        <p className="flex justify-center items-center gap-2 text-[14px]">
                          <FaCircleArrowLeft className="text-[15px]" /> Sign Out
                        </p>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </span>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* ⭐ UPDATED: Side Menu with role-based items */}
      <div
        className={`fixed z-50 left-0 top-[80px] md:top-[100px] w-[200px] md:w-[330px] h-auto px-4 md:px-8 py-4 md:py-8 rounded-r-[20px] bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 bg-white/5 justify-center overflow-hidden transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex flex-col  font-body">
          <div className="flex justify-end items-center">
            {/* <div>
              <h1 className="font2-medium text-[12px] md:text-[16px] tracking-wide uppercase text-white">
                {user?.role === 'admin' ? 'Admin Menu' : 'Menu'}
              </h1>
            </div> */}
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="p-1 rounded hover:bg-white/10 active:scale-95 transition"
            >
              <X color="white" />
            </button>
          </div>

          <div className="w-full flex flex-col text-[12px] md:text-[16px] justify-center gap-8 md:gap-10 mb-4">
            {/* <Link to={"/"}>
              <p className=" tracking-wide uppercase text-white">Home</p>
            </Link>
            <Link to={"/about"}>
              <p className="tracking-wide uppercase text-white">About Us</p>
            </Link> */}

            {/* ⭐ NEW: Conditional menu based on role */}
            {user?.role === "admin" ? (
              // Admin Menu
              <>
                {adminMenuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                  >
                    <p className="tracking-wide uppercase text-white hover:text-ac transition-colors flex items-center gap-2">
                      <span>{item.icon}</span>
                      {item.label}
                    </p>
                  </Link>
                ))}
              </>
            ) : (
              // Regular User Menu
              <>
                {userMenuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                  >
                    <p className="tracking-wide uppercase text-white hover:text-[#955E30] transition-colors">
                      {item.label}
                    </p>
                  </Link>
                ))}
              </>
            )}

            {/* ⭐ NEW: Sign out button at bottom of menu (only if logged in) */}
            {isLoggedIn && (
              <>
                <span className="bg-white/20 w-full h-px"></span>
                <button
                  onClick={handleLogout}
                  className="tracking-wide uppercase text-white hover:text-red-500 transition-colors flex items-center gap-2"
                >
                  <FaCircleArrowLeft className="text-[15px]" />
                  Sign Out
                </button>{" "}
              </>
            )}

            {/* Product + Dropdown  mb-[-15px]*/}
            {/* <div className="w-full">
              <Link to={"/product"}>
                <button
                  type="button"
                  // onClick={() => setProductOpen((o) => !o)}
                  className="w-full flex justify-between items-center tracking-wide uppercase text-white cursor-pointer select-none"
                  // aria-expanded={productOpen}
                  // aria-controls="product-menu"
                >
                  Product
                </button>
              </Link> */}

            {/* <div
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
                              </div> */}
            {/* </div> */}

            {/* <Link to={"/wishlist"}>
              <p className=" tracking-wide uppercase text-white">Wishlist</p>
            </Link>
            <Link to={"/profile"}>
              <p className=" tracking-wide uppercase text-white">profile</p>
            </Link>
            <Link to={"/faq"}>
              <p className=" tracking-wide uppercase text-white">FAQ</p>
            </Link>
            <Link to={"/contact"}>
              <p className=" tracking-wide uppercase text-white">Contact</p>
            </Link> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
