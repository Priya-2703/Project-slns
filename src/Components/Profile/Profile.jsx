import React, { useState, useEffect, useContext } from "react";
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
  Loader,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContext } from "../../Context/UseToastContext";

const Profile = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddAddressPopup, setShowAddAddressPopup] = useState(false); // ✅ ADD THIS
  const [newAddress, setNewAddress] = useState({
    area: "",
    landmark: "",
    town_city: "",
    state: "",
    country: "India",
    pincode: "",
    type: "Home",
    isDefault: false,
  });
  const [savingAddress, setSavingAddress] = useState(false);
  const [showEditAddressPopup, setShowEditAddressPopup] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [editAddressData, setEditAddressData] = useState({
    area: "",
    landmark: "",
    town_city: "",
    state: "",
    country: "India",
    pincode: "",
    type: "Home",
    isDefault: false,
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useContext(ToastContext);

  // Backend URL
  const BACKEND_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    document.title = `Profile - SLNS Sarees`;
  }, [location]);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const token = localStorage.getItem("token");

      // If no token found, show auth popup
      if (!token) {
        setIsAuthenticated(false);
        setShowAuthPopup(true);
        setLoading(false);
        return;
      }

      // User is authenticated
      setIsAuthenticated(true);
      setShowAuthPopup(false);

      try {
        // Fetch all user data in parallel
        await Promise.all([
          fetchUserProfile(token),
          fetchUserOrders(token),
          fetchUserAddresses(token),
        ]);
      } catch (error) {
        console.error("Error loading user data:", error);
        // If token is invalid, show auth popup
        if (
          error.message.includes("401") ||
          error.message.includes("Unauthorized")
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("userData");
          setIsAuthenticated(false);
          setShowAuthPopup(true);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // ✅ User Data State with default avatar
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    picture: "",
    address: "",
  });

  const [editData, setEditData] = useState({ ...userData });
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);

  // ✅ Fetch User Profile from Backend
  const fetchUserProfile = async (token) => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();

      // ✅ Handle profile picture (Google or default)
      const profileData = {
        ...data.user,
        picture:
          data.user.picture ||
          data.user.avatar ||
          getDefaultAvatar(data.user.name),
      };

      setUserData(profileData);
      setEditData(profileData);

      console.log("api/profile", data);

      // Save to localStorage
      localStorage.setItem("userData", JSON.stringify(profileData));
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error.message);

      // Load from localStorage as fallback
      const savedUser = localStorage.getItem("userData");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        parsedUser.picture =
          parsedUser.picture || getDefaultAvatar(parsedUser.name);
        setUserData(parsedUser);
        setEditData(parsedUser);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get default avatar (UI Avatars API or local icon)
  const getDefaultAvatar = (name) => {
    if (name) {
      // Use UI Avatars API
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=8E6740&color=fff&size=200&bold=true`;
    }
    return null; // Will show CircleUserRound icon
  };

  // ✅ Fetch User Orders
  const fetchUserOrders = async (token) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/profile/orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  // ✅ Fetch User Addresses
  const fetchUserAddresses = async (token) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/profile/addresses`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch addresses");
      }

      const data = await response.json();

      console.log("address", data);
      setAddresses(data.addresses || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setAddresses([]);
    }
  };

  // ✅ Handle Edit Address Click
  const handleEditAddressClick = (address) => {
    setEditingAddress(address);
    setEditAddressData({
      area: address.area || "",
      landmark: address.landmark || "",
      town_city: address.town_city || "",
      state: address.state || "",
      country: address.country || "India",
      pincode: address.pincode || "",
      type: address.type || "Home",
      isDefault: address.isDefault || false,
    });
    setShowEditAddressPopup(true);
  };

  // ✅ Handle Edit Address Input Change
  const handleEditAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditAddressData({
      ...editAddressData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Update Address
  const handleUpdateAddress = async () => {
    try {
      // Validation
      if (
        !editAddressData.area ||
        !editAddressData.town_city ||
        !editAddressData.state ||
        !editAddressData.country ||
        !editAddressData.pincode
      ) {
        showToast("Please fill all required fields", "error");
        return;
      }

      setSavingAddress(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${BACKEND_URL}/api/addresses/${
          editingAddress.id || editingAddress._id
        }`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editAddressData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update address");
      }

      const data = await response.json();
      console.log("Address updated:", data);

      if (data.success) {
        // Update the addresses array
        setAddresses(
          addresses.map((addr) =>
            (addr.id || addr._id) === (editingAddress.id || editingAddress._id)
              ? data.address
              : addr
          )
        );
        setShowEditAddressPopup(false);
        setEditingAddress(null);
        showToast("Address updated successfully!", "success");

        // Reset form
        setEditAddressData({
          area: "",
          landmark: "",
          town_city: "",
          state: "",
          country: "India",
          pincode: "",
          type: "Home",
          isDefault: false,
        });
      }
    } catch (error) {
      console.error("Error updating address:", error);
      showToast("Failed to update address. Please try again.", "error");
    } finally {
      setSavingAddress(false);
    }
  };

  // ✅ Cancel Edit Address
  const handleCancelEditAddress = () => {
    setShowEditAddressPopup(false);
    setEditingAddress(null);
    setEditAddressData({
      area: "",
      landmark: "",
      town_city: "",
      state: "",
      country: "India",
      pincode: "",
      type: "Home",
      isDefault: false,
    });
  };

  // ✅ Update Profile
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${BACKEND_URL}/api/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      console.log("api/update", data);

      if (data.success) {
        // ✅ Use backend response if available, otherwise use editData
        const backendUser = data.user || data.data || editData;

        setUserData(backendUser);
        setEditData(backendUser);

        console.log("updatedData", backendUser);

        localStorage.setItem("userData", JSON.stringify(backendUser));

        alert("Profile updated successfully!");
      }
      setIsEditing(false);

      console.log("isediting", isEditing);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...userData });
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

  // ✅ Delete Address
  const deleteAddress = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${BACKEND_URL}/api/addresses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete address");
      }

      setAddresses(addresses.filter((addr) => addr.id !== id));
      alert("Address deleted successfully!");
    } catch (error) {
      console.error("Error deleting address:", error);
      alert("Failed to delete address. Please try again.");
    }
  };

  // ✅ Add New Address Handler
  const handleAddAddressClick = () => {
    setShowAddAddressPopup(true);
    setNewAddress({
      area: "",
      landmark: "",
      town_city: "",
      state: "",
      country: "India",
      pincode: "",
      type: "Home",
      isDefault: false,
    });
  };

  // ✅ Handle Address Input Change
  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Save New Address
  const handleSaveAddress = async () => {
    try {
      // Validation
      if (
        !newAddress.area ||
        !newAddress.town_city ||
        !newAddress.state ||
        !newAddress.country ||
        !newAddress.pincode
      ) {
        showToast("Please fill all required fields", "error");
        return;
      }

      setSavingAddress(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${BACKEND_URL}/api/profile/addresses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAddress),
      });

      if (!response.ok) {
        throw new Error("Failed to add address");
      }

      const data = await response.json();
      console.log("Address added:", data);

      if (data.success) {
        setAddresses([...addresses, data.address]);
        setShowAddAddressPopup(false);
        showToast("Address added successfully!", "success");

        // Reset form
        setNewAddress({
          area: "",
          landmark: "",
          town_city: "",
          state: "",
          country: "India",
          pincode: "",
          type: "Home",
          isDefault: false,
        });
      }
    } catch (error) {
      console.error("Error adding address:", error);
      showToast("Failed to add address. Please try again.", "error");
    } finally {
      setSavingAddress(false);
    }
  };

  // ✅ Cancel Add Address
  const handleCancelAddAddress = () => {
    setShowAddAddressPopup(false);
    setNewAddress({
      area: "",
      landmark: "",
      town_city: "",
      state: "",
      country: "India",
      pincode: "",
      type: "Home",
      isDefault: false,
    });
  };

  // ✅ Set Default Address
  const setDefaultAddress = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${BACKEND_URL}/api/addresses/${id}/default`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to set default address");
      }

      setAddresses(
        addresses.map((addr) => ({
          ...addr,
          isDefault: addr.id === id,
        }))
      );

      alert("Default address updated!");
    } catch (error) {
      console.error("Error setting default address:", error);
      alert("Failed to update default address. Please try again.");
    }
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

  // Animation variants (keep existing ones)
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

  // ✅ Loading Screen
  if (loading && !showAuthPopup) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="min-h-screen bg-black text-white mt-20 md:mt-28"
    >
      {/* Authentication Popup - SAME AS BEFORE */}
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

      {/* Profile Content */}
      {isAuthenticated && (
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
              {/* Sidebar Navigation */}
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
                    {/* ✅ Profile Picture with Google Image or Default */}
                    {userData.picture ? (
                      <motion.img
                        src={userData.picture}
                        alt={userData.name}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                        onError={(e) => {
                          // Fallback to default avatar if image fails to load
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                        className="md:w-20 md:h-20 w-16 h-16 rounded-full object-cover flex justify-center items-center border-4 border-white/10 md:mb-3"
                      />
                    ) : null}

                    {/* ✅ Default Icon (shown if no image) */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className={`md:w-20 md:h-20 w-16 h-16 rounded-full flex justify-center items-center border-4 border-white/10 md:mb-3 bg-gradient-to-br from-[#8E6740] to-[#6b4e2f] ${
                        userData.picture ? "hidden" : "flex"
                      }`}
                    >
                      <CircleUserRound
                        size={mobileView ? 40 : 50}
                        strokeWidth={1.5}
                        color="white"
                        className="nav-item"
                      />
                    </motion.div>

                    <div className="flex flex-col justify-center items-start lg:items-center ml-3 lg:ml-0">
                      <h3 className="text-[14px] md:text-[18px] capitalize font-body font-medium">
                        {userData.name || "User"}
                      </h3>
                      <p className="text-gray-400 font-body text-[10px] md:text-[12px]">
                        {userData.email || "email@example.com"}
                      </p>
                    </div>
                  </motion.div>

                  {/* Navigation Tabs - SAME AS BEFORE */}
                  <nav className="lg:space-y-2 flex lg:flex-col justify-around items-center gap-2">
                    {[
                      { id: "profile", icon: User, label: "Profile Info" },
                      { id: "orders", icon: Package, label: "My Orders" },
                      { id: "addresses", icon: MapPin, label: "Addresses" },
                      {
                        id: "changePassword",
                        icon: Settings,
                        label: "Change Password",
                      },
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

              {/* Main Content - Profile Info Tab */}
              <div className="lg:col-span-3">
                <AnimatePresence mode="wait">
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
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSave}
                                disabled={loading}
                                className="flex items-center gap-2 text-[12px] md:text-[16px] bg-green-600 px-3 md:px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 disabled:opacity-50"
                              >
                                {loading ? (
                                  <Loader
                                    size={mobileView ? 14 : 18}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Save size={mobileView ? 14 : 18} />
                                )}
                                Save
                              </motion.button>
                              <motion.button
                                type="button"
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
                                    value={editData[field.name] || ""}
                                    onChange={handleInputChange}
                                    className="outline-none flex-1 text-[14px] md:text-[16px] text-white bg-black"
                                  >
                                    <option value="" className="bg-black">
                                      Select Gender
                                    </option>
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
                                    value={editData[field.name] || ""}
                                    onChange={handleInputChange}
                                    className="bg-transparent outline-none flex-1 text-white text-[14px] md:text-[16px]"
                                  />
                                )
                              ) : (
                                <span className="text-[14px] md:text-[16px]">
                                  {field.name === "dob" && field.value
                                    ? new Date(field.value).toLocaleDateString()
                                    : field.value || "Not set"}
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

                      {orders.length === 0 ? (
                        <div className="bg-black rounded-[20px] p-12 border border-gray-800 text-center">
                          <Package
                            size={48}
                            className="mx-auto mb-4 text-gray-600"
                          />
                          <p className="text-gray-400 text-lg">No orders yet</p>
                          <button
                            onClick={() => navigate("/product")}
                            className="mt-4 bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-all"
                          >
                            Start Shopping
                          </button>
                        </div>
                      ) : (
                        orders.map((order, index) => (
                          <motion.div
                            key={order.id || order._id}
                            variants={cardVariants}
                            custom={index}
                            whileHover={{ scale: 1.02, y: -5 }}
                            transition={{ duration: 0.3 }}
                            className="bg-black rounded-[20px] p-6 border border-gray-800 hover:border-gray-700"
                          >
                            <div className="flex flex-wrap justify-between items-start mb-4">
                              <div>
                                <h3 className="text-xl font-bold mb-2">
                                  {order.order_id || order.id}
                                </h3>
                                <p className="text-gray-400 text-[12px] md:text-[14px]">
                                  Order Date:{" "}
                                  {new Date(
                                    order.created_at || order.date
                                  ).toLocaleDateString()}
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
                                  {order.items?.length || order.items} Items
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {(order.products || order.items)?.map(
                                  (product, idx) => (
                                    <motion.span
                                      key={idx}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: idx * 0.1 }}
                                      whileHover={{ scale: 1.1 }}
                                      className="bg-gray-800 px-3 py-1 rounded-full text-[12px] md:text-[14px]"
                                    >
                                      {product.name || product}
                                    </motion.span>
                                  )
                                )}
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-2xl font-bold text-green-400">
                                  ₹{order.total || order.total_amount}
                                </span>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() =>
                                    navigate(`/orders/${order.id || order._id}`)
                                  }
                                  className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition-all duration-300 font-semibold"
                                >
                                  View Details
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
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
                          onClick={handleAddAddressClick}
                          className="bg-white text-black text-[12px] md:text-[16px] px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-300 font-semibold"
                        >
                          + Add New Address
                        </motion.button>
                      </div>

                      {addresses.length === 0 ? (
                        <div className="bg-black rounded-[20px] p-12 border border-gray-800 text-center">
                          <MapPin
                            size={48}
                            className="mx-auto mb-4 text-gray-600"
                          />
                          <p className="text-gray-400 text-lg">
                            No saved addresses
                          </p>
                          <button
                            onClick={handleAddAddressClick}
                            className="mt-4 bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-all"
                          >
                            Add Address
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <AnimatePresence>
                            {addresses.map((addr, index) => (
                              <motion.div
                                key={addr.id || addr._id}
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
                                  {addr.area && `${addr.area}, `}
                                  {addr.landmark && `${addr.landmark}, `}
                                  {addr.town_city && `${addr.town_city}, `}
                                  {addr.state && `${addr.state}, `}
                                  {addr.country && `${addr.country} - `}
                                  {addr.pincode}
                                </p>
                                <div className="flex gap-2">
                                  {!addr.isDefault && (
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() =>
                                        setDefaultAddress(addr.id || addr._id)
                                      }
                                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-[12px] font-body md:text-[14px] px-3 md:px-4 py-2 rounded-lg transition-all duration-300"
                                    >
                                      Set as Default
                                    </motion.button>
                                  )}
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleEditAddressClick(addr)}
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
                                    onClick={() => {
                                      if (
                                        window.confirm(
                                          "Are you sure you want to delete this address?"
                                        )
                                      ) {
                                        deleteAddress(addr.id || addr._id);
                                      }
                                    }}
                                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-all duration-300"
                                  >
                                    <X size={mobileView ? 14 : 18} />
                                  </motion.button>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Settings Tab - SAME AS BEFORE */}
                  {activeTab === "changePassword" && (
                    <motion.div
                      key="changePassword"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="bg-black rounded-[20px] p-4 md:p-8 border border-gray-800 font-body"
                    >
                      <h2 className="text-2xl font-bold mb-6">
                        Change Password
                      </h2>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </>
      )}
      {/* add address popup */}
      <AnimatePresence>
        {showAddAddressPopup && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={handleCancelAddAddress}
            />

            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
              <motion.div
                variants={popupVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl my-8"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold font-heading">
                    Add New Address
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCancelAddAddress}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </motion.button>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  {/* Area */}
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block font-body">
                      Area / Locality *
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={newAddress.area}
                      onChange={handleAddressInputChange}
                      placeholder="Enter area or locality"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                    />
                  </div>

                  {/* Landmark */}
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block font-body">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={newAddress.landmark}
                      onChange={handleAddressInputChange}
                      placeholder="Enter nearby landmark"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                    />
                  </div>

                  {/* Town/City & State */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block font-body">
                        Town / City *
                      </label>
                      <input
                        type="text"
                        name="town_city"
                        value={newAddress.town_city}
                        onChange={handleAddressInputChange}
                        placeholder="Enter city"
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block font-body">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={newAddress.state}
                        onChange={handleAddressInputChange}
                        placeholder="Enter state"
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                      />
                    </div>
                  </div>

                  {/* Country & Pincode */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block font-body">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={newAddress.country}
                        onChange={handleAddressInputChange}
                        placeholder="Enter country"
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block font-body">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={newAddress.pincode}
                        onChange={handleAddressInputChange}
                        placeholder="Enter pincode"
                        maxLength="6"
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                      />
                    </div>
                  </div>

                  {/* Address Type */}
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block font-body">
                      Address Type
                    </label>
                    <select
                      name="type"
                      value={newAddress.type}
                      onChange={handleAddressInputChange}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Default Address Checkbox */}
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      name="isDefault"
                      id="isDefault"
                      checked={newAddress.isDefault}
                      onChange={handleAddressInputChange}
                      className="w-5 h-5 rounded border-gray-700 bg-gray-800/50 text-white focus:ring-2 focus:ring-gray-500 cursor-pointer"
                    />
                    <label
                      htmlFor="isDefault"
                      className="text-gray-300 font-body cursor-pointer"
                    >
                      Set as default address
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-8">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveAddress}
                    disabled={savingAddress}
                    className="flex-1 bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2 font-body disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {savingAddress ? (
                      <>
                        <Loader size={20} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        Save Address
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancelAddAddress}
                    className="flex-1 bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-all duration-300 flex items-center justify-center gap-2 font-body"
                  >
                    <X size={20} />
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* edit address popup */}
      {/* ✅ EDIT ADDRESS POPUP */}
      <AnimatePresence>
        {showEditAddressPopup && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={handleCancelEditAddress}
            />

            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
              <motion.div
                variants={popupVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl my-8"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold font-heading">
                    Edit Address
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCancelEditAddress}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </motion.button>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  {/* Area */}
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block font-body">
                      Area / Locality *
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={editAddressData.area}
                      onChange={handleEditAddressInputChange}
                      placeholder="Enter area or locality"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                    />
                  </div>

                  {/* Landmark */}
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block font-body">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={editAddressData.landmark}
                      onChange={handleEditAddressInputChange}
                      placeholder="Enter nearby landmark"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                    />
                  </div>

                  {/* Town/City & State */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block font-body">
                        Town / City *
                      </label>
                      <input
                        type="text"
                        name="town_city"
                        value={editAddressData.town_city}
                        onChange={handleEditAddressInputChange}
                        placeholder="Enter city"
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block font-body">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={editAddressData.state}
                        onChange={handleEditAddressInputChange}
                        placeholder="Enter state"
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                      />
                    </div>
                  </div>

                  {/* Country & Pincode */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block font-body">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={editAddressData.country}
                        onChange={handleEditAddressInputChange}
                        placeholder="Enter country"
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block font-body">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={editAddressData.pincode}
                        onChange={handleEditAddressInputChange}
                        placeholder="Enter pincode"
                        maxLength="6"
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                      />
                    </div>
                  </div>

                  {/* Address Type */}
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block font-body">
                      Address Type
                    </label>
                    <select
                      name="type"
                      value={editAddressData.type}
                      onChange={handleEditAddressInputChange}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Default Address Checkbox */}
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      name="isDefault"
                      id="editIsDefault"
                      checked={editAddressData.isDefault}
                      onChange={handleEditAddressInputChange}
                      className="w-5 h-5 rounded border-gray-700 bg-gray-800/50 text-white focus:ring-2 focus:ring-gray-500 cursor-pointer"
                    />
                    <label
                      htmlFor="editIsDefault"
                      className="text-gray-300 font-body cursor-pointer"
                    >
                      Set as default address
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-8">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUpdateAddress}
                    disabled={savingAddress}
                    className="flex-1 bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2 font-body disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {savingAddress ? (
                      <>
                        <Loader size={20} className="animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        Update Address
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancelEditAddress}
                    className="flex-1 bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-all duration-300 flex items-center justify-center gap-2 font-body"
                  >
                    <X size={20} />
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Profile;
