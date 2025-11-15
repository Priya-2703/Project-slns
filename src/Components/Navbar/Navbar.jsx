import { CircleUserRound, ShoppingCart, X } from "lucide-react";
import { assets } from "../../../public/assets/asset";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoBusiness } from "react-icons/io5";
import { GoHeart } from "react-icons/go";
import { WishlistContext } from "../../Context/UseWishListContext";
import { ToastContext } from "../../Context/UseToastContext";
import { CartContext } from "../../Context/UseCartContext";
import { AuthContext } from "../../Context/UseAuthContext";

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const { showToast } = useContext(ToastContext);
  const [showCard, setShowCard] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const cardRef = useRef(null);
  const signRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsLoggedIn(false);
    setShowCard(false);
    setMenuOpen(false);
    navigate("/");
    showToast("Logged out successfully");
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

  // ⭐ NEW: Show navbar when cursor is at top
  useEffect(() => {
    const handleMouseMove = (e) => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setShowNavbar(true);
      } else if (e.clientY <= 100) {
        setShowNavbar(true);
      } else if (e.clientY > 300 && currentScrollY > 100) {
        setShowNavbar(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [lastScrollY, menuOpen]);

  // ⭐ NEW: Handle scroll to show/hide navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNavbar(false);
      }

      setLastScrollY(currentScrollY);

      if (menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, menuOpen]);

  const mobileView = window.innerWidth < 480;

  const adminMenuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/products", label: "View Products", icon: "📦" },
    { path: "/admin/products/add", label: "Add Product", icon: "➕" },
    { path: "/admin/categories", label: "Manage Categories", icon: "🏷️" },
    { path: "/admin/import", label: "Bulk Import", icon: "📥" },
    { path: "/admin/orders", label: "Order Management", icon: "🛒" },
    { path: "/admin/customers", label: "Customer Management", icon: "👥" },
  ];

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
      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            filter: drop-shadow(0 0 2px rgba(149, 94, 48, 0.3));
            transform: scale(1);
          }
          50% {
            filter: drop-shadow(0 0 12px rgba(149, 94, 48, 0.8)) drop-shadow(0 0 20px rgba(149, 94, 48, 0.4));
            transform: scale(1.02);
          }
        }

        .logo-glow {
          animation: pulse-glow 2.5s ease-in-out infinite;
        }

        .logo-glow:hover {
          animation: pulse-glow 1s ease-in-out infinite;
        }

        @keyframes tooltip-fade {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(5px);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .tooltip-show {
          animation: tooltip-fade 0.3s ease-out forwards;
        }

        /* ⭐ NEW: Navbar slide animation */
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(-100%);
            opacity: 0;
          }
        }

        .navbar-show {
          animation: slideDown 0.3s ease-out forwards;
        }

        .navbar-hide {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>

      {/* ⭐ UPDATED: Added conditional class for show/hide */}
      <div
        className={`fixed top-0 w-full mx-auto py-1 md:py-4 px-5 lg:px-7 z-50 bg-transparent transition-transform duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="relative">
            <img
              src={assets.logo}
              alt="logo"
              loading="lazy"
              data-cursor-scale
              className="w-[60px] md:w-[90px] cursor-pointer select-none logo-glow transition-all duration-300"
              onClick={() => setMenuOpen(true)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            />

            <div
              className={`absolute left-10 top-[70px] md:top-[100px] whitespace-nowrap
                bg-[#955E30] text-white text-[8px] md:text-[10px] px-3 py-1.5 rounded-lg
                font-body font-medium shadow-lg
                transition-all duration-300 pointer-events-none
                ${showTooltip ? "opacity-100 tooltip-show" : "opacity-0"}
              `}
            >
              Tap to open menu
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#955E30] rotate-45"></div>
            </div>
          </div>

          <div className="flex justify-center items-center gap-8 md:gap-16">
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

              <div
                ref={cardRef}
                className={`absolute top-[30px] z-50 font-['Poppins'] right-[-3px] w-[120px] md:w-[160px] glass-card py-2 px-1 rounded-[14px] transition-all duration-300 ${
                  showCard
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <div className="flex flex-col justify-center items-center gap-1">
                  {isLoggedIn && user && (
                    <div className="w-full  px-3 py-2 mb-2">
                      <Link
                        to={"/profile"}
                        className=" flex items-center gap-2 text-white hover:text-white/60 transition-all duration-200"
                      >
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
                          <p className=" text-[10px] font-body">{user.email}</p>
                        </div>
                      </Link>
                      {user.role === "admin" && (
                        <span className="inline-block mt-1 bg-[#955E30] capitalize font-body text-white text-[9px] px-2 py-0.5 rounded-full">
                          Admin
                        </span>
                      )}
                    </div>
                  )}

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
                        <p className="text-white/60 hover:text-white transition-all duration-200 flex justify-center items-center gap-2 text-[12px] md:text-[14px]">
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

      {/* Side Menu */}
      <div
        className={`fixed z-50 left-0 top-20 md:top-[120px] w-[200px] md:w-[330px] h-full px-4 md:px-8 py-4 md:py-8 rounded-r-[20px] bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 bg-white/5 justify-center overflow-hidden transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex flex-col  font-body">
          <div className="flex justify-end items-center">
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="p-1 rounded hover:bg-white/10 active:scale-95 transition"
            >
              <X color="white" />
            </button>
          </div>

          <div className="w-full flex flex-col text-[12px] md:text-[16px] justify-center gap-8 md:gap-10 mb-4">
            {user?.role === "admin" ? (
              <>
                {adminMenuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className="cursor-pointer select-none"
                  >
                    <p className="tracking-wide uppercase cursor-pointer select-none text-white hover:text-ac transition-colors flex items-center gap-2">
                      <span>{item.icon}</span>
                      {item.label}
                    </p>
                  </Link>
                ))}
              </>
            ) : (
              <>
                {userMenuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                  >
                    <p className="tracking-wide uppercase cursor-pointer text-white hover:text-accet transition-colors">
                      {item.label}
                    </p>
                  </Link>
                ))}
              </>
            )}
            {isLoggedIn && (
              <>
                <span className="bg-white/20 w-full h-px"></span>
                <button
                  onClick={handleLogout}
                  className="tracking-wide uppercase text-white hover:text-red-500 transition-colors flex items-center gap-2"
                >
                  <FaCircleArrowLeft className="text-[15px]" />
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
