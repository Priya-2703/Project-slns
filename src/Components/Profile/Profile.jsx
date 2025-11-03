import React, { useState, useEffect } from "react";
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  Edit2,
  Save,
  X,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  Truck,
  CheckCircle,
  Clock,
  LogIn,
  CircleUserRound,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    //dynamic title
    document.title = `Profile - SLNS Sarees`;

    const token =
      localStorage.getItem("authToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken");

    const userDataString =
      localStorage.getItem("userData") || localStorage.getItem("user");

    console.log("Auth Check - Token:", token);
    console.log("Auth Check - UserData:", userDataString);

    if (token && userDataString) {
      setIsAuthenticated(true);
      const parsedUser = JSON.parse(userDataString);
      setUserData(parsedUser);
      setShowAuthPopup(false); // ADD THIS
    } else {
      setIsAuthenticated(false);
      setShowAuthPopup(true);
    }
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [userData, setUserData] = useState({});

  const [editData, setEditData] = useState({ ...userData });

  const [orders] = useState([
    {
      id: "#ORD001",
      date: "2024-01-15",
      items: 3,
      total: 2499,
      status: "Delivered",
      products: ["Cotton T-Shirt", "Denim Jeans", "Sneakers"],
    },
    {
      id: "#ORD002",
      date: "2024-01-20",
      items: 2,
      total: 1899,
      status: "Shipped",
      products: ["Formal Shirt", "Trousers"],
    },
    {
      id: "#ORD003",
      date: "2024-01-22",
      items: 1,
      total: 899,
      status: "Processing",
      products: ["Hoodie"],
    },
  ]);

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "Home",
      address: "123, Anna Nagar, Chennai - 600040",
      isDefault: true,
    },
    {
      id: 2,
      type: "Work",
      address: "456, T Nagar, Chennai - 600017",
      isDefault: false,
    },
  ]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...userData });
  };

  const handleSave = () => {
    setUserData({ ...editData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ ...userData });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const deleteAddress = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  const setDefaultAddress = (id) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const handleSignInRedirect = () => {
    navigate("/signin");
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      Delivered: "bg-green-500/20 text-green-400 border-green-500",
      Shipped: "bg-blue-500/20 text-blue-400 border-blue-500",
      Processing: "bg-yellow-500/20 text-yellow-400 border-yellow-500",
      Cancelled: "bg-red-500/20 text-red-400 border-red-500",
    };

    const icons = {
      Delivered: <CheckCircle size={14} />,
      Shipped: <Truck size={14} />,
      Processing: <Clock size={14} />,
    };

    return (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${styles[status]}`}
      >
        {icons[status]}
        {status}
      </motion.span>
    );
  };

  const mobileView = window.innerWidth < 480;

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const sidebarVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const navItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        delay: i * 0.05,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const popupVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
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
      className="min-h-screen bg-black text-white mt-20 md:mt-28"
    >
      {/* Authentication Popup */}
      <AnimatePresence>
        {showAuthPopup && !isAuthenticated && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setShowAuthPopup(false)}
            />

            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div
                variants={popupVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-3xl p-8 md:p-12 max-w-md w-full shadow-2xl"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex justify-center mb-6"
                >
                  <div className="bg-white/10 p-6 rounded-full">
                    <LogIn size={48} className="text-white" />
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl md:text-3xl font-bold text-center mb-4 font-heading"
                >
                  Sign In Required
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-400 text-center mb-8 font-body"
                >
                  Please sign in to access your profile and manage your orders
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignInRedirect}
                  className="w-full bg-white text-black font-bold py-4 rounded-full hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-3 font-body text-lg"
                >
                  <LogIn size={20} />
                  Sign In Now
                </motion.button>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/")}
                  className="w-full mt-4 text-gray-400 hover:text-white transition-all duration-300 font-body"
                >
                  Go back to Home
                </motion.button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Profile Content - SIMPLIFIED WRAPPER */}
      {isAuthenticated ? (
        <>
          {/* Header */}
          <div className="mx-2 lg:mx-0">
            <motion.div
              variants={headerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-7xl mx-auto px-4 py-3 md:py-8"
            >
              <h1 className="text-[35px] md:text-[50px] font-heading font-[950] md:leading-15">
                My Account
              </h1>
              <p className="text-gray-400 font-body text-[10px] md:text-[13px] tracking-wide">
                Manage your profile and orders
              </p>
            </motion.div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-3 md:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar Navigation - FIXED */}
              <motion.div
                variants={sidebarVariants}
                initial="hidden"
                animate="visible"
                className="lg:col-span-1"
              >
                <div className="bg-black rounded-[20px] lg:p-6 p-3 border border-gray-900 lg:sticky lg:top-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex lg:flex-col items-center mb-6 ml-0"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="md:w-20 md:h-20 w-16 h-16 rounded-full flex justify-center items-center border-4 border-white/10 md:mb-3"
                    >
                      <CircleUserRound
                        size={mobileView ? 16 : 100}
                        strokeWidth={1.5}
                        color="white"
                        className="nav-item"
                      />
                    </motion.div>
                    <div className="flex flex-col justify-center items-start lg:items-center">
                      <h3 className="text-[14px] md:text-[18px] capitalize font-body font-medium">
                        {userData.name}
                      </h3>
                      <p className="text-gray-400 font-body text-[10px] md:text-[12px]">
                        {userData.email}
                      </p>
                    </div>
                  </motion.div>

                  <nav className="lg:space-y-2 flex lg:flex-col justify-around items-center gap-2">
                    {[
                      { id: "profile", icon: User, label: "Profile Info" },
                      { id: "orders", icon: Package, label: "My Orders" },
                      { id: "addresses", icon: MapPin, label: "Addresses" },
                      { id: "settings", icon: Settings, label: "Settings" },
                    ].map((item, index) => (
                      <motion.button
                        key={item.id}
                        variants={navItemVariants}
                        custom={index}
                        onClick={() => setActiveTab(item.id)}
                        whileHover={{ scale: 1.05, x: 5 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`lg:w-full flex items-center justify-center lg:justify-start gap-3 p-3 md:px-4 md:py-3 font-body font-extrabold text-[14px] md:text-[16px] rounded-[50px] transition-all duration-300 ${
                          activeTab === item.id
                            ? "bg-white text-black font-black"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        }`}
                      >
                        <item.icon size={20} />
                        <span className="hidden lg:inline">{item.label}</span>
                      </motion.button>
                    ))}
                  </nav>
                </div>
              </motion.div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <AnimatePresence mode="wait">
                  {/* Profile Info Tab */}
                  {activeTab === "profile" && (
                    <motion.div
                      key="profile"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="bg-black rounded-[20px] p-6 md:p-8 border border-gray-900"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-[16px] md:text-[24px] font-body font-bold">
                          Profile Information
                        </h2>
                        <AnimatePresence mode="wait">
                          {!isEditing ? (
                            <motion.button
                              key="edit"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleEdit}
                              className="flex items-center font-body gap-2 text-[12px] md:text-[16px] bg-white text-black px-3 md:px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-300"
                            >
                              <Edit2 size={mobileView ? 14 : 18} />
                              Edit Profile
                            </motion.button>
                          ) : (
                            <motion.div
                              key="actions"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="flex font-body gap-2"
                            >
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSave}
                                className="flex items-center gap-2 text-[12px] md:text-[16px] bg-green-600 px-3 md:px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300"
                              >
                                <Save size={mobileView ? 14 : 18} />
                                Save
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCancel}
                                className="flex items-center gap-2 text-[12px] md:text-[16px] bg-red-600 px-3 md:px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300"
                              >
                                <X size={mobileView ? 14 : 18} />
                                Cancel
                              </motion.button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          {
                            name: "name",
                            label: "Full Name",
                            icon: User,
                            value: userData.name,
                            type: "text",
                          },
                          {
                            name: "email",
                            label: "Email Address",
                            icon: Mail,
                            value: userData.email,
                            type: "email",
                          },
                          {
                            name: "phone",
                            label: "Phone Number",
                            icon: Phone,
                            value: userData.phone,
                            type: "tel",
                          },
                          {
                            name: "dob",
                            label: "Date of Birth",
                            icon: Calendar,
                            value: userData.dob,
                            type: "date",
                          },
                          {
                            name: "gender",
                            label: "Gender",
                            icon: User,
                            value: userData.gender,
                            type: "select",
                          },
                        ].map((field, index) => (
                          <motion.div
                            key={field.name}
                            variants={inputVariants}
                            custom={index}
                          >
                            <label className="text-gray-400 text-[12px] md:text-[14px] mb-2 block">
                              {field.label}
                            </label>
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center gap-3 bg-black px-3 py-2 md:px-4 md:py-3 font-body rounded-[60px] border border-gray-800"
                            >
                              <field.icon
                                size={mobileView ? 14 : 20}
                                className="text-gray-400"
                              />
                              {isEditing ? (
                                field.type === "select" ? (
                                  <select
                                    name={field.name}
                                    value={editData[field.name]}
                                    onChange={handleInputChange}
                                    className="outline-none flex-1 text-[14px] md:text-[16px] text-white bg-black"
                                  >
                                    <option value="Male" className="bg-black">
                                      Male
                                    </option>
                                    <option value="Female" className="bg-black">
                                      Female
                                    </option>
                                    <option value="Other" className="bg-black">
                                      Other
                                    </option>
                                  </select>
                                ) : (
                                  <input
                                    type={field.type}
                                    name={field.name}
                                    value={editData[field.name]}
                                    onChange={handleInputChange}
                                    className="bg-transparent outline-none flex-1 text-white"
                                  />
                                )
                              ) : (
                                <span className="text-[14px] md:text-[16px]">
                                  {field.name === "dob"
                                    ? new Date(field.value).toLocaleDateString()
                                    : field.value}
                                </span>
                              )}
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Orders Tab */}
                  {activeTab === "orders" && (
                    <motion.div
                      key="orders"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-4 font-body"
                    >
                      <h2 className="text-[24px] font-body font-bold mb-6">
                        My Orders
                      </h2>
                      {orders.map((order, index) => (
                        <motion.div
                          key={order.id}
                          variants={cardVariants}
                          custom={index}
                          whileHover={{ scale: 1.02, y: -5 }}
                          transition={{ duration: 0.3 }}
                          className="bg-black rounded-[20px] p-6 border border-gray-800 hover:border-gray-700"
                        >
                          <div className="flex flex-wrap justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-bold mb-2">
                                {order.id}
                              </h3>
                              <p className="text-gray-400 text-[12px] md:text-[14px]">
                                Order Date:{" "}
                                {new Date(order.date).toLocaleDateString()}
                              </p>
                            </div>
                            <StatusBadge status={order.status} />
                          </div>

                          <div className="border-t border-gray-800 pt-4 mt-4">
                            <div className="flex items-center gap-2 mb-3">
                              <ShoppingBag
                                size={mobileView ? 14 : 18}
                                className="text-gray-400"
                              />
                              <span className="text-gray-400">
                                {order.items} Items
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {order.products.map((product, idx) => (
                                <motion.span
                                  key={idx}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: idx * 0.1 }}
                                  whileHover={{ scale: 1.1 }}
                                  className="bg-gray-800 px-3 py-1 rounded-full text-[12px] md:text-[14px]"
                                >
                                  {product}
                                </motion.span>
                              ))}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-2xl font-bold text-green-400">
                                ₹{order.total}
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition-all duration-300 font-semibold"
                              >
                                Track Order
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Addresses Tab */}
                  {activeTab === "addresses" && (
                    <motion.div
                      key="addresses"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div className="flex justify-between font-body items-center mb-6">
                        <h2 className="text-[16px] md:text-[24px] font-bold">
                          Saved Addresses
                        </h2>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-white text-black text-[12px] md:text-[16px] px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-300 font-semibold"
                        >
                          + Add New Address
                        </motion.button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnimatePresence>
                          {addresses.map((addr, index) => (
                            <motion.div
                              key={addr.id}
                              variants={cardVariants}
                              custom={index}
                              layout
                              exit={{
                                opacity: 0,
                                scale: 0.8,
                                transition: { duration: 0.3 },
                              }}
                              whileHover={{ scale: 1.03, y: -5 }}
                              transition={{ duration: 0.3 }}
                              className="bg-black rounded-xl font-body p-4 md:p-6 border border-gray-800 hover:border-gray-700"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                  <MapPin
                                    size={mobileView ? 14 : 20}
                                    className="text-gray-400"
                                  />
                                  <span className="font-bold font-body text-[14px] md:text-[16px]">
                                    {addr.type}
                                  </span>
                                </div>
                                {addr.isDefault && (
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 200,
                                    }}
                                    className="bg-green-500/20 font-body text-green-400 px-3 py-1 rounded-full text-xs font-semibold border border-green-500"
                                  >
                                    Default
                                  </motion.span>
                                )}
                              </div>
                              <p className="text-gray-400 text-[14px] font-body md:text-[16px] mb-4">
                                {addr.address}
                              </p>
                              <div className="flex gap-2">
                                {!addr.isDefault && (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setDefaultAddress(addr.id)}
                                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-[12px] font-body md:text-[14px] px-3 md:px-4 py-2 rounded-lg transition-all duration-300"
                                  >
                                    Set as Default
                                  </motion.button>
                                )}
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-[12px] font-body md:text-[16px] px-4 py-2 rounded-lg transition-all duration-300"
                                >
                                  Edit
                                </motion.button>
                                <motion.button
                                  whileHover={{
                                    scale: 1.1,
                                    backgroundColor: "#dc2626",
                                  }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => deleteAddress(addr.id)}
                                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-all duration-300"
                                >
                                  <X size={mobileView ? 14 : 18} />
                                </motion.button>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}

                  {/* Settings Tab */}
                  {activeTab === "settings" && (
                    <motion.div
                      key="settings"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="bg-black rounded-[20px] p-4 md:p-8 border border-gray-800 font-body"
                    >
                      <h2 className="text-2xl font-bold mb-6">
                        Account Settings
                      </h2>
                      <div className="space-y-2 md:space-y-4">
                        {[
                          {
                            title: "Change Password",
                            desc: "Update your password regularly for security",
                          },
                          {
                            title: "Notification Preferences",
                            desc: "Manage email and SMS notifications",
                          },
                          {
                            title: "Privacy Settings",
                            desc: "Control your data and privacy options",
                          },
                          {
                            title: "Payment Methods",
                            desc: "Manage saved cards and payment options",
                          },
                          {
                            title: "Delete Account",
                            desc: "Permanently delete your account",
                            danger: true,
                          },
                        ].map((setting, idx) => (
                          <motion.div
                            key={idx}
                            variants={cardVariants}
                            custom={idx}
                            whileHover={{ scale: 1.02, x: 5 }}
                            transition={{ duration: 0.2 }}
                            className={`p-4 rounded-[20px] border transition-all duration-300 cursor-pointer ${
                              setting.danger
                                ? "border-red-800 bg-red-900/20 hover:bg-red-900/30"
                                : "border-gray-800 bg-gray-800/50 hover:bg-gray-800"
                            }`}
                          >
                            <h3
                              className={`font-bold md:mb-1 text-[14px] md:text-[16px] ${
                                setting.danger ? "text-red-400" : ""
                              }`}
                            >
                              {setting.title}
                            </h3>
                            <p className="text-gray-400 text-[12px] md:text-[14px]">
                              {setting.desc}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </motion.div>
  );
};

export default Profile;
