import React, { useState, useEffect, useContext } from "react";
import {
  User,
  Package,
  Eye,
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
  EyeOff,
  Lock,
  Upload,
  RefreshCw,
  DollarSign,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContext } from "../../Context/UseToastContext";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddAddressPopup, setShowAddAddressPopup] = useState(false);
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

  // ✅ NEW - Return Order States
  const [showReturnPopup, setShowReturnPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnFormData, setReturnFormData] = useState({
    reason: "",
    comments: "",
    action: "refund", // 'refund' or 'exchange'
    images: [],
  });
  const [refundPaymentMethod, setRefundPaymentMethod] = useState("upi"); // 'upi' or 'bank'
  const [refundPaymentDetails, setRefundPaymentDetails] = useState({
    upi_id: "",
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
    bank_name: "",
  });
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);

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

      if (!token) {
        setIsAuthenticated(false);
        setShowAuthPopup(true);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);
      setShowAuthPopup(false);

      try {
        await Promise.all([
          fetchUserProfile(token),
          fetchUserOrders(token),
          fetchUserAddresses(token),
        ]);
      } catch (error) {
        console.error("Error loading user data:", error);
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

  // ✅ Fetch User Profile
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

      const profileData = {
        ...data.user,
        picture:
          data.user.picture ||
          data.user.avatar ||
          getDefaultAvatar(data.user.name),
      };

      setUserData(profileData);
      setEditData(profileData);

      localStorage.setItem("userData", JSON.stringify(profileData));
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error.message);

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

  const getDefaultAvatar = (name) => {
    if (name) {
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=8E6740&color=fff&size=200&bold=true`;
    }
    return null;
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
      console.log("Orders", data.orders);
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

      const formattedAddresses = (data.addresses || []).map((addr) => ({
        id: addr.id,
        type: addr.type || "Home",
        isDefault: addr.isDefault || false,
        area: addr.full_details?.area || "",
        landmark: addr.full_details?.landmark || "",
        town_city: addr.full_details?.town_city || "",
        state: addr.full_details?.state || "",
        country: addr.full_details?.country || "India",
        pincode: addr.full_details?.pincode || "",
        house_no: addr.full_details?.house_no || "",
      }));

      console.log("formatted Addresses", formattedAddresses);
      setAddresses(formattedAddresses || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setAddresses([]);
    }
  };

  // ✅ NEW - Handle Return Button Click
  const handleReturnClick = (order) => {
    setSelectedOrder(order);
    setShowReturnPopup(true);
    setReturnFormData({
      reason: "",
      comments: "",
      action: "refund",
      images: [],
    });
    setImagePreview([]);
  };

  // ✅ NEW - Handle Return Form Input Change
  const handleReturnInputChange = (e) => {
    const { name, value } = e.target;
    setReturnFormData({
      ...returnFormData,
      [name]: value,
    });
  };

  // ✅ NEW - Handle Image Upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + returnFormData.images.length > 5) {
      showToast("Maximum 5 images allowed", "error");
      return;
    }

    // Create preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreview([...imagePreview, ...newPreviews]);

    // Store actual files
    setReturnFormData({
      ...returnFormData,
      images: [...returnFormData.images, ...files],
    });
  };

  // ✅ NEW - Remove Image
  const handleRemoveImage = (index) => {
    const newImages = [...returnFormData.images];
    const newPreviews = [...imagePreview];

    // Revoke URL to free memory
    URL.revokeObjectURL(newPreviews[index]);

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setReturnFormData({
      ...returnFormData,
      images: newImages,
    });
    setImagePreview(newPreviews);
  };

  // ✅ NEW - Submit Return Request
  const handleSubmitReturn = async () => {
    try {
      // Validation
      if (!returnFormData.reason) {
        showToast("Please select a reason for return", "error");
        return;
      }

      if (!returnFormData.comments.trim()) {
        showToast("Please provide additional comments", "error");
        return;
      }

      // ✅ NEW - Validate refund payment details
      if (returnFormData.action === "refund") {
        if (refundPaymentMethod === "upi") {
          if (!refundPaymentDetails.upi_id.trim()) {
            showToast("Please enter UPI ID for refund", "error");
            return;
          }
          // Basic UPI ID validation
          if (!refundPaymentDetails.upi_id.includes("@")) {
            showToast("Please enter a valid UPI ID", "error");
            return;
          }
        } else if (refundPaymentMethod === "bank") {
          if (
            !refundPaymentDetails.account_holder_name.trim() ||
            !refundPaymentDetails.account_number.trim() ||
            !refundPaymentDetails.ifsc_code.trim()
          ) {
            showToast("Please fill all bank details for refund", "error");
            return;
          }
          // IFSC code validation (11 characters)
          if (refundPaymentDetails.ifsc_code.length !== 11) {
            showToast("IFSC code must be 11 characters", "error");
            return;
          }
        }
      }

      setSubmittingReturn(true);
      const token = localStorage.getItem("token");

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("order_id", selectedOrder.id || selectedOrder._id);
      formData.append("reason", returnFormData.reason);
      formData.append("comments", returnFormData.comments);
      formData.append("action", returnFormData.action);

      // ✅ NEW - Add refund payment details
      if (returnFormData.action === "refund") {
        formData.append("refund_method", refundPaymentMethod);
        if (refundPaymentMethod === "upi") {
          formData.append("upi_id", refundPaymentDetails.upi_id);
        } else {
          formData.append(
            "account_holder_name",
            refundPaymentDetails.account_holder_name
          );
          formData.append(
            "account_number",
            refundPaymentDetails.account_number
          );
          formData.append("ifsc_code", refundPaymentDetails.ifsc_code);
          formData.append("bank_name", refundPaymentDetails.bank_name);
        }
      }

      // Append images
      returnFormData.images.forEach((image, index) => {
        formData.append("images", image);
      });

      const response = await fetch(`${BACKEND_URL}/api/orders/return`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.message || data.error || "Failed to submit return request";
        showToast(errorMessage, "error");
        return;
      }

      // Success
      showToast("Return request submitted successfully!", "success");

      // Refresh orders
      await fetchUserOrders(token);

      // Close popup
      handleCancelReturn();
    } catch (error) {
      console.error("Error submitting return:", error);
      showToast(
        error.message || "Failed to submit return request. Please try again.",
        "error"
      );
    } finally {
      setSubmittingReturn(false);
    }
  };

  // ✅ payment
  const handlePaymentDetailsChange = (e) => {
    const { name, value } = e.target;
    setRefundPaymentDetails({
      ...refundPaymentDetails,
      [name]: value,
    });
  };

  // ✅ NEW - Cancel Return
  const handleCancelReturn = () => {
    setShowReturnPopup(false);
    setSelectedOrder(null);
    setReturnFormData({
      reason: "",
      comments: "",
      action: "refund",
      images: [],
    });
    setRefundPaymentMethod("upi");
    setRefundPaymentDetails({
      upi_id: "",
      account_holder_name: "",
      account_number: "",
      ifsc_code: "",
      bank_name: "",
    });
    imagePreview.forEach((url) => URL.revokeObjectURL(url));
    setImagePreview([]);
  };

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

  const handleEditAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditAddressData({
      ...editAddressData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleUpdateAddress = async () => {
    try {
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

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || data.error || "Error occurred";
        showToast(errorMessage, "error");
        return;
      }

      await fetchUserAddresses(token);
      setShowEditAddressPopup(false);
      setEditingAddress(null);
      showToast("Address updated successfully!", "success");

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
    } catch (error) {
      console.error("Error updating address:", error);
      showToast(
        error.message || "Failed to update address. Please try again.",
        "error"
      );
    } finally {
      setSavingAddress(false);
    }
  };

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

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${BACKEND_URL}/api/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || data.error || "Error occurred";
        showToast(errorMessage, "error");
        return;
      }

      if (data.user) {
        const updatedUserData = {
          ...data.user,
          picture: userData.picture || getDefaultAvatar(data.user.name),
        };
        setUserData(updatedUserData);
        setEditData(updatedUserData);
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
        setIsEditing(false);

        showToast(data.message || "Profile updated successfully!", "success");
      } else {
        throw new Error("No user data received from server");
      }
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      showToast(
        error.message || "Failed to update profile. Please try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      ...userData,
      picture: userData.picture || getDefaultAvatar(userData.name),
    });
  };

  const handleCancel = () => {
    setEditData({
      ...userData,
      picture: userData.picture || getDefaultAvatar(userData.name),
    });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

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
        const errorMessage = data.message || data.error || "Error occurred";
        showToast(errorMessage, "error");
        return;
      }

      setAddresses(addresses.filter((addr) => addr.id !== id));
      alert("Address deleted successfully!");
    } catch (error) {
      console.error("Error deleting address:", error);
      alert("Failed to delete address. Please try again.");
    }
  };

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

  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSaveAddress = async () => {
    try {
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
        const errorMessage =
          data.message || data.error || "Failed to add address";
        showToast(errorMessage, "error");
        return;
      }

      const data = await response.json();

      await fetchUserAddresses(token);
      setShowAddAddressPopup(false);
      showToast("Address added successfully!", "success");

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
    } catch (error) {
      console.error("Error adding address:", error);
      showToast(
        error.message || "Failed to add address. Please try again.",
        "error"
      );
    } finally {
      setSavingAddress(false);
    }
  };

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

  // const setDefaultAddress = async (id) => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     const response = await fetch(
  //       `${BACKEND_URL}/api/addresses/${id}/default`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to set default address");
  //     }

  //     setAddresses(
  //       addresses.map((addr) => ({
  //         ...addr,
  //         isDefault: addr.id === id,
  //       }))
  //     );

  //     alert("Default address updated!");
  //   } catch (error) {
  //     console.error("Error setting default address:", error);
  //     alert("Failed to update default address. Please try again.");
  //   }
  // };

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

  // Animation variants
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

  if (loading && !showAuthPopup) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">{t("profile.loading")}</p>
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
      {/* Authentication Popup - Keep existing */}
      <AnimatePresence>
        {showAuthPopup && !isAuthenticated && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
              onClick={() => setShowAuthPopup(false)}
            />

            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div
                variants={popupVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-linear-to-br from-white/10 via-black/10 to-white/10 border border-white/20 rounded-3xl p-8 md:p-12 max-w-md w-full shadow-2xl"
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
                  {t("profile.auth_popup.title")}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-400 text-center mb-8 font-body"
                >
                  {t("profile.auth_popup.description")}
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignInRedirect}
                  className="w-full bg-white text-black py-3 rounded-full hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-3 font-body text-[14px]"
                >
                  <LogIn size={20} />
                  {t("profile.auth_popup.signin_btn")}
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
                  {t("profile.auth_popup.home_btn")}
                </motion.button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Profile Content */}
      {isAuthenticated && (
        <>
          {/* Header - Keep existing */}
          <div className="mx-2 lg:mx-0">
            <motion.div
              variants={headerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-7xl mx-auto px-4 py-3 md:py-8"
            >
              <h1 className="text-[35px] md:text-[50px] font-heading font-[950] md:leading-15">
                {t("profile.header.title")}
              </h1>
              <p className="text-gray-400 font-body text-[10px] md:text-[13px] tracking-wide">
                {t("profile.header.subtitle")}
              </p>
            </motion.div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-3 md:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar - Keep existing */}
              <motion.div
                variants={sidebarVariants}
                initial="hidden"
                animate="visible"
                className="lg:col-span-1"
              >
                <div className="bg-black rounded-[20px] lg:p-6 p-3 bg-linear-to-br from-white/10 via-black/10 to-white/10 border border-white/20 lg:sticky lg:top-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex lg:flex-col items-center mb-6 ml-0"
                  >
                    {userData.picture ? (
                      <motion.img
                        src={userData.picture}
                        alt={userData.name}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                        className="md:w-20 md:h-20 w-16 h-16 rounded-full object-cover flex justify-center items-center border-2 border-white/10 md:mb-3"
                      />
                    ) : null}

                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className={`md:w-20 md:h-20 w-16 h-16 rounded-full flex justify-center items-center border-4 border-white/10 md:mb-3 bg-linear-to-br from-[#8E6740] to-[#6b4e2f] ${
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

                  <nav className="lg:space-y-2 flex lg:flex-col justify-around items-center gap-2">
                    {[
                      {
                        id: "profile",
                        icon: User,
                        label: t("profile.sidebar.profile_info"),
                      },
                      {
                        id: "orders",
                        icon: Package,
                        label: t("profile.sidebar.my_orders"),
                      },
                      {
                        id: "addresses",
                        icon: MapPin,
                        label: t("profile.sidebar.addresses"),
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
                        className={`lg:w-full flex items-center justify-center lg:justify-start gap-3 p-3 md:px-4 md:py-3 font-body font-extrabold text-[14px] md:text-[16px] rounded-[50px] transition-all duration-200 ${
                          activeTab === item.id
                            ? "bg-white text-black font-black"
                            : "text-gray-400 hover:bg-white/10 border-0 hover:border hover:border-white/20 hover:text-white"
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
                  {/* Profile Tab - Keep existing */}
                  {activeTab === "profile" && (
                    <motion.div
                      key="profile"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className=" rounded-[20px] p-6 md:p-8 bg-linear-to-br from-white/10 via-black/10 to-white/10 border border-white/20"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-[16px] md:text-[24px] font-body font-bold">
                          {t("profile.personal_info.title")}
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
                              className="flex items-center font-body gap-2 text-[12px] md:text-[16px] bg-linear-to-tr from-white/20 via-black/10 to-white/20 border border-white/40 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-black transition-all duration-300"
                            >
                              <Edit2 size={mobileView ? 14 : 18} />
                              {t("profile.personal_info.edit_btn")}
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
                                disabled={saving}
                                className="flex items-center gap-2 text-[12px] md:text-[16px] bg-green-800/20 border border-green-700 px-3 md:px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 disabled:opacity-50"
                              >
                                {saving ? (
                                  <Loader
                                    size={mobileView ? 14 : 18}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Save size={mobileView ? 14 : 18} />
                                )}
                                {t("profile.personal_info.save_btn")}
                              </motion.button>
                              <motion.button
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCancel}
                                className="flex items-center gap-2 text-[12px] md:text-[16px] bg-red-800/20 border border-red-700 px-3 md:px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300"
                              >
                                <X size={mobileView ? 14 : 18} />
                                {t("profile.personal_info.cancel_btn")}
                              </motion.button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          {
                            name: "name",
                            label: t("profile.personal_info.labels.full_name"),
                            icon: User,
                            value: userData.name,
                            type: "text",
                          },
                          {
                            name: "email",
                            label: t("profile.personal_info.labels.email"),
                            icon: Mail,
                            value: userData.email,
                            type: "email",
                          },
                          {
                            name: "phone",
                            label: t("profile.personal_info.labels.phone"),
                            icon: Phone,
                            value: userData.phone,
                            type: "tel",
                          },
                          {
                            name: "dob",
                            label: t("profile.personal_info.labels.dob"),
                            icon: Calendar,
                            value: userData.dob,
                            type: "date",
                          },
                          {
                            name: "gender",
                            label: t("profile.personal_info.labels.gender"),
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
                              className="flex items-center gap-3  px-3 py-2 md:px-4 md:py-3 font-body rounded-[60px] bg-linear-to-r from-white/10 to-black/20 border border-white/20"
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
                                      {t(
                                        "profile.personal_info.gender_options.select"
                                      )}
                                    </option>
                                    <option value="Male" className="bg-black">
                                      {t(
                                        "profile.personal_info.gender_options.male"
                                      )}
                                    </option>
                                    <option value="Female" className="bg-black">
                                      {t(
                                        "profile.personal_info.gender_options.female"
                                      )}
                                    </option>
                                    <option value="Other" className="bg-black">
                                      {t(
                                        "profile.personal_info.gender_options.other"
                                      )}
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

                  {/* ✅ UPDATED - Orders Tab with Return Button */}
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
                        {t("profile.orders.title")}
                      </h2>

                      {orders.length === 0 ? (
                        <div className="bg-linear-to-br from-white/10 via-black/10 to-white/10 border border-white/20 rounded-[20px] p-12 text-center">
                          <Package
                            size={48}
                            className="mx-auto mb-4 text-gray-600"
                          />
                          <p className="text-gray-400 text-lg">
                            {t("profile.orders.no_orders")}
                          </p>
                          <button
                            onClick={() => navigate("/product")}
                            className="mt-4 bg-white text-black font-body px-6 py-3 rounded-full hover:bg-gray-200 transition-all"
                          >
                            {t("profile.orders.start_shopping")}
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
                            className="rounded-[20px] p-6 bg-linear-to-br from-white/10 via-black/10 to-white/10 border border-white/20"
                          >
                            <div className="flex flex-wrap justify-between items-start mb-4">
                              <div>
                                <h3 className="text-xl font-bold mb-2">
                                  {order.order_id || order.id}
                                </h3>
                                <p className="text-gray-400 text-[12px] md:text-[14px]">
                                  {t("profile.orders.order_date")}{" "}
                                  {new Date(
                                    order.created_at || order.date
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <StatusBadge status={order.status} />
                            </div>

                            <div className="border-t border-white/20 pt-4 mt-4">
                              <div className="flex items-center gap-2 mb-3">
                                <ShoppingBag
                                  size={mobileView ? 14 : 18}
                                  className="text-gray-400"
                                />
                                <span className="text-gray-400">
                                  {order.items?.length || order.items}{" "}
                                  {t("profile.orders.items")}
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
                                      className="bg-linear-to-br from-white/10 via-black/10 to-white/10 border border-white/20 px-3 py-1 rounded-full text-[11px] md:text-[12px]"
                                    >
                                      {product.name || product}
                                    </motion.span>
                                  )
                                )}
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-2xl font-sans font-bold text-white">
                                  ₹{order.total || order.total_amount}
                                </span>

                                {/* ✅ RETURN BUTTON - Only show for Delivered orders */}
                                {order.status === "Delivered" && (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleReturnClick(order)}
                                    className="bg-white text-black px-6 py-2 text-[12px] md:text-[14px] rounded-full hover:bg-gray-200 transition-all duration-300 font-body font-[500] flex items-center gap-2"
                                  >
                                    <RefreshCw size={16} />
                                    Return Order
                                  </motion.button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </motion.div>
                  )}

                  {/* Addresses Tab - Keep existing */}
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
                          {t("profile.addresses.title")}
                        </h2>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleAddAddressClick}
                          className=" text-white bg-linear-to-br from-white/10 via-black/10 to-white/10 border border-white/20 text-[12px] md:text-[14px] px-4 py-3 rounded-lg hover:bg-white/20 transition-all duration-300 "
                        >
                          {t("profile.addresses.add_new_btn")}
                        </motion.button>
                      </div>

                      {addresses.length === 0 ? (
                        <div className="bg-linear-to-br from-white/10 via-black/10 to-white/10 border border-white/20 rounded-[20px] p-12 text-center">
                          <MapPin
                            size={48}
                            className="mx-auto mb-4 text-gray-600"
                          />
                          <p className="text-gray-400 text-lg">
                            {t("profile.addresses.no_saved")}
                          </p>
                          <button
                            onClick={handleAddAddressClick}
                            className="mt-4 bg-white text-black font-body px-6 py-3 rounded-lg hover:bg-gray-200 transition-all"
                          >
                            {t("profile.addresses.add_btn_short")}
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
                                className="rounded-xl font-body p-4 md:p-6 bg-linear-to-br from-white/10 via-black/10 to-white/10 border border-white/20"
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
                                  <motion.button
                                    whileHover={{ scale: 0.9 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleEditAddressClick(addr)}
                                    className="flex-1 bg-white hover:bg-white/10 hover:text-white border border-white/20 text-[12px] font-body md:text-[16px] px-4 py-2 rounded-full text-black transition-all duration-200"
                                  >
                                    {t("profile.addresses.edit")}
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
                                          `${t(
                                            "profile.addresses.delete_confirm"
                                          )}`
                                        )
                                      ) {
                                        deleteAddress(addr.id || addr._id);
                                      }
                                    }}
                                    className="bg-red-600/20 border border-red-700 hover:bg-red-700 px-4 py-2 rounded-lg transition-all duration-300"
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
                </AnimatePresence>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ✅ NEW - Return Order Popup with Refund Details */}
      <AnimatePresence>
        {showReturnPopup && selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
              onClick={handleCancelReturn}
            />

            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
              <motion.div
                variants={popupVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-linear-to-br max-h-[90vh] overflow-scroll from-white/10 via-black/10 to-white/10 border border-white/20 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl my-8"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold font-heading">
                      Return Order
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                      Order ID: {selectedOrder.order_id || selectedOrder.id}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCancelReturn}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </motion.button>
                </div>

                {/* Form */}
                <div className="space-y-6">
                  {/* Reason Dropdown */}
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block font-body">
                      Reason for Return <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="reason"
                      value={returnFormData.reason}
                      onChange={handleReturnInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                    >
                      <option value="" className="bg-white text-black font-body">
                        Select a reason
                      </option>
                      <option value="size/fitting_issue" className="bg-white text-black font-body">
                        Size/fitting issue
                      </option>
                      <option value="wrong_item" className="bg-white text-black font-body">
                        Received wrong item
                      </option>
                      <option value="damaged" className="bg-white text-black font-body">
                        Damaged/Defective
                      </option>
                      <option value="quality" className="bg-white text-black font-body">
                        Quality issue
                      </option>
                      <option value="item_missing" className="bg-white text-black font-body">
                        Item missing in the package (Part of product is missing)
                      </option>
                    </select>
                  </div>

                  {/* Comments Textarea */}
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block font-body">
                      Additional Comments{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="comments"
                      value={returnFormData.comments}
                      onChange={handleReturnInputChange}
                      placeholder="Please provide more details about the issue..."
                      rows="4"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body resize-none"
                    />
                  </div>

                  {/* Action Required */}
                  <div>
                    <label className="text-gray-400 text-sm mb-3 block font-body">
                      What would you like?{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          setReturnFormData({
                            ...returnFormData,
                            action: "refund",
                          })
                        }
                        className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                          returnFormData.action === "refund"
                            ? "border-green-500 bg-green-500/20 text-white"
                            : "border-white/20 bg-white/5 text-gray-400 hover:border-white/40"
                        }`}
                      >
                        <DollarSign size={24} />
                        <span className="font-body font-semibold">Refund</span>
                      </motion.button>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          setReturnFormData({
                            ...returnFormData,
                            action: "exchange",
                          })
                        }
                        className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                          returnFormData.action === "exchange"
                            ? "border-blue-500 bg-blue-500/20 text-white"
                            : "border-white/20 bg-white/5 text-gray-400 hover:border-white/40"
                        }`}
                      >
                        <RefreshCw size={24} />
                        <span className="font-body font-semibold">
                          Exchange
                        </span>
                      </motion.button>
                    </div>
                  </div>

                  {/* ✅ NEW - Refund Payment Details Section */}
                  <AnimatePresence>
                    {returnFormData.action === "refund" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-white/20 pt-6 space-y-4"
                      >
                        <h3 className="text-white font-body font-bold text-lg mb-4">
                          Refund Payment Details{" "}
                          <span className="text-red-500">*</span>
                        </h3>

                        {/* Payment Method Toggle */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setRefundPaymentMethod("upi")}
                            className={`p-3 rounded-lg border-2 transition-all duration-300 font-body font-semibold ${
                              refundPaymentMethod === "upi"
                                ? "border-purple-500 bg-purple-500/20 text-white"
                                : "border-white/20 bg-white/5 text-gray-400 hover:border-white/40"
                            }`}
                          >
                            UPI ID
                          </motion.button>

                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setRefundPaymentMethod("bank")}
                            className={`p-3 rounded-lg border-2 transition-all duration-300 font-body font-semibold ${
                              refundPaymentMethod === "bank"
                                ? "border-purple-500 bg-purple-500/20 text-white"
                                : "border-white/20 bg-white/5 text-gray-400 hover:border-white/40"
                            }`}
                          >
                            Bank Account
                          </motion.button>
                        </div>

                        {/* UPI Form */}
                        {refundPaymentMethod === "upi" && (
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <label className="text-gray-400 text-sm mb-2 block font-body">
                              UPI ID <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="upi_id"
                              value={refundPaymentDetails.upi_id}
                              onChange={handlePaymentDetailsChange}
                              placeholder="example@upi"
                              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors font-body"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              Enter your UPI ID (e.g., yourname@paytm,
                              9876543210@ybl)
                            </p>
                          </motion.div>
                        )}

                        {/* Bank Account Form */}
                        {refundPaymentMethod === "bank" && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                          >
                            {/* Account Holder Name */}
                            <div>
                              <label className="text-gray-400 text-sm mb-2 block font-body">
                                Account Holder Name{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="account_holder_name"
                                value={refundPaymentDetails.account_holder_name}
                                onChange={handlePaymentDetailsChange}
                                placeholder="Enter account holder name"
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors font-body"
                              />
                            </div>

                            {/* Account Number */}
                            <div>
                              <label className="text-gray-400 text-sm mb-2 block font-body">
                                Account Number{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="account_number"
                                value={refundPaymentDetails.account_number}
                                onChange={handlePaymentDetailsChange}
                                placeholder="Enter account number"
                                maxLength="18"
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors font-body"
                              />
                            </div>

                            {/* IFSC Code */}
                            <div>
                              <label className="text-gray-400 text-sm mb-2 block font-body">
                                IFSC Code{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="ifsc_code"
                                value={refundPaymentDetails.ifsc_code}
                                onChange={handlePaymentDetailsChange}
                                placeholder="Enter IFSC code"
                                maxLength="11"
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors font-body uppercase"
                                style={{ textTransform: "uppercase" }}
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                11-character IFSC code (e.g., SBIN0001234)
                              </p>
                            </div>

                            {/* Bank Name */}
                            <div>
                              <label className="text-gray-400 text-sm mb-2 block font-body">
                                Bank Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="bank_name"
                                value={refundPaymentDetails.bank_name}
                                onChange={handlePaymentDetailsChange}
                                placeholder="Enter bank name"
                                required
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors font-body"
                              />
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Image Upload */}
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block font-body">
                      Upload Images (Optional) - Max 5 images
                    </label>
                    <div className="space-y-3">
                      <label className="w-full bg-white/10 border-2 border-dashed border-white/20 rounded-lg px-4 py-6 text-white outline-none hover:border-gray-500 transition-colors font-body cursor-pointer flex flex-col items-center gap-2">
                        <Upload size={32} className="text-gray-400" />
                        <span className="text-sm text-gray-400">
                          Click to upload or drag and drop
                        </span>
                        <span className="text-xs text-gray-500">
                          PNG, JPG, JPEG (Max 5MB each)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>

                      {/* Image Previews */}
                      {imagePreview.length > 0 && (
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                          {imagePreview.map((preview, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="relative group"
                            >
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg border border-white/20"
                              />
                              <motion.button
                                type="button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleRemoveImage(index)}
                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={14} />
                              </motion.button>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-8">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmitReturn}
                    disabled={submittingReturn}
                    className="flex-1 bg-green-600/20 border border-green-700 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2 font-body disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingReturn ? (
                      <>
                        <Loader size={20} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={20} />
                        Submit Return Request
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancelReturn}
                    className="flex-1 bg-red-600/20 border border-red-700 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-2 font-body"
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

      {/* Add address popup - Keep existing code */}
      <AnimatePresence>
        {showAddAddressPopup && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
              onClick={handleCancelAddAddress}
            />

            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
              <motion.div
                variants={popupVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-linear-to-br from-white/10 via-black/10 to-white/10 border border-white/20 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl my-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold font-heading">
                    {t("profile.address_form.add_title")}
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

                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block font-body">
                      {t("profile.address_form.labels.area")}
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={newAddress.area}
                      onChange={handleAddressInputChange}
                      placeholder="Enter area or locality"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-2 block font-body">
                      {t("profile.address_form.labels.landmark")}
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={newAddress.landmark}
                      onChange={handleAddressInputChange}
                      placeholder="Enter nearby landmark"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block font-body">
                        {t("profile.address_form.labels.city")}
                      </label>
                      <input
                        type="text"
                        name="town_city"
                        value={newAddress.town_city}
                        onChange={handleAddressInputChange}
                        placeholder="Enter city"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block font-body">
                        {t("profile.address_form.labels.state")}
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={newAddress.state}
                        onChange={handleAddressInputChange}
                        placeholder="Enter state"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block font-body">
                        {t("profile.address_form.labels.country")}
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={newAddress.country}
                        onChange={handleAddressInputChange}
                        placeholder="Enter country"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block font-body">
                        {t("profile.address_form.labels.pincode")}
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={newAddress.pincode}
                        onChange={handleAddressInputChange}
                        placeholder="Enter pincode"
                        maxLength="6"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-2 block font-body">
                      {t("profile.address_form.labels.type")}
                    </label>
                    <select
                      name="type"
                      value={newAddress.type}
                      onChange={handleAddressInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                    >
                      <option
                        className="bg-transparent font-body text-black"
                        value="Home"
                      >
                        {t("profile.address_form.types.home")}
                      </option>
                      <option
                        className="bg-transparent font-body text-black"
                        value="Work"
                      >
                        {t("profile.address_form.types.work")}
                      </option>
                      <option
                        className="bg-transparent font-body text-black"
                        value="Other"
                      >
                        {t("profile.address_form.types.other")}
                      </option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveAddress}
                    disabled={savingAddress}
                    className="flex-1 bg-green-600/20 border border-green-700 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2 font-body disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {savingAddress ? (
                      <>
                        <Loader size={20} className="animate-spin" />
                        {t("profile.address_form.buttons.saving")}
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        {t("profile.address_form.buttons.save")}
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancelAddAddress}
                    className="flex-1 bg-red-600/20 border border-red-700 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-2 font-body"
                  >
                    <X size={20} />
                    {t("profile.address_form.buttons.cancel")}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* edit address popup - Keep existing code */}
      <AnimatePresence>
        {showEditAddressPopup && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
              onClick={handleCancelEditAddress}
            />

            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
              <motion.div
                variants={popupVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-linear-to-br from-white/10 via-black/10 to-white/10 border border-white/20 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl my-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold font-heading">
                    {t("profile.address_form.edit_title")}
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

                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block font-body">
                      {t("profile.address_form.labels.area")}
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={editAddressData.area}
                      onChange={handleEditAddressInputChange}
                      placeholder="Enter area or locality"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-2 block font-body">
                      {t("profile.address_form.labels.landmark")}
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={editAddressData.landmark}
                      onChange={handleEditAddressInputChange}
                      placeholder="Enter nearby landmark"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block font-body">
                        {t("profile.address_form.labels.city")}
                      </label>
                      <input
                        type="text"
                        name="town_city"
                        value={editAddressData.town_city}
                        onChange={handleEditAddressInputChange}
                        placeholder="Enter city"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block font-body">
                        {t("profile.address_form.labels.state")}
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={editAddressData.state}
                        onChange={handleEditAddressInputChange}
                        placeholder="Enter state"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block font-body">
                        {t("profile.address_form.labels.country")}
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={editAddressData.country}
                        onChange={handleEditAddressInputChange}
                        placeholder="Enter country"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block font-body">
                        {t("profile.address_form.labels.pincode")}
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={editAddressData.pincode}
                        onChange={handleEditAddressInputChange}
                        placeholder="Enter pincode"
                        maxLength="6"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-2 block font-body">
                      {t("profile.address_form.labels.type")}
                    </label>
                    <select
                      name="type"
                      value={editAddressData.type}
                      onChange={handleEditAddressInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-gray-500 transition-colors font-body"
                    >
                      <option
                        className="bg-transparent font-body text-black"
                        value="Home"
                      >
                        {t("profile.address_form.types.home")}
                      </option>
                      <option
                        className="bg-transparent font-body text-black"
                        value="Work"
                      >
                        {t("profile.address_form.types.work")}
                      </option>
                      <option
                        className="bg-transparent font-body text-black"
                        value="Other"
                      >
                        {t("profile.address_form.types.other")}
                      </option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUpdateAddress}
                    disabled={savingAddress}
                    className="flex-1 bg-green-600/20 border border-green-700 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2 font-body disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {savingAddress ? (
                      <>
                        <Loader size={20} className="animate-spin" />
                        {t("profile.address_form.buttons.updating")}
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        {t("profile.address_form.buttons.update")}
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancelEditAddress}
                    className="flex-1 bg-red-600/20 border border-red-700 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-2 font-body"
                  >
                    <X size={20} />
                    {t("profile.address_form.buttons.cancel")}
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
