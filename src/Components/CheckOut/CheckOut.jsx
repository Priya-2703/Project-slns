import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  MapPin,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Home,
  Plus,
  Check,
  Package,
  Truck,
  ShieldCheck,
  Loader,
} from "lucide-react";
import { CartContext } from "../../Context/UseCartContext";
import { getImageUrl } from "../../utils/imageHelper";
import { MdPayment } from "react-icons/md";
import {
  createRazorpayOrder,
  loadRazorpayScript,
  placeOrder,
  verifyPayment,
} from "../../utils/razorpayHelper";
import { ToastContext } from "../../Context/UseToastContext";
import { FaArrowLeft } from "react-icons/fa";

export default function CheckOut() {
  const navigate = useNavigate();
  const {
    cart,
    totalPrice,
    totalItems,
    clearCart,
    loading: cartLoading,
  } = useContext(CartContext);
  const { showToast } = useContext(ToastContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [useNewAddress, setUseNewAddress] = useState(false);

  // ✅ NEW STATES FOR USER DETAILS
  const [showNewUserDetails, setShowNewUserDetails] = useState(false);
  const [useNewUserDetails, setUseNewUserDetails] = useState(false);
  const [useSavedUserDetails, setUseSavedUserDetails] = useState(true); // ✅ NEW

  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_API_URL;

  // ✅ Saved user details (from profile - READ ONLY)
  const [savedUserDetails, setSavedUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // ✅ New user details (editable)
  const [newUserDetails, setNewUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [newAddress, setNewAddress] = useState({
    type: "home",
    address: "",
    area: "",
    landmark: "",
    town_city: "",
    state: "",
    country: "India",
    pincode: "",
  });

  const [paymentData, setPaymentData] = useState({
    method: "cod",
  });

  const [errors, setErrors] = useState({});
  const [savedAddresses, setSavedAddresses] = useState([]);

  // Fetch User Details from Checkout API
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        const savedUserData = localStorage.getItem("userData");
        if (savedUserData) {
          const userData = JSON.parse(savedUserData);
          populateUserDetails(userData);
        }
        setProfileLoading(false);
        return;
      }

      try {
        setProfileLoading(true);

        const response = await fetch(
          `${BACKEND_URL}/api/checkout/user-details`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const data = await response.json();

        if (data.user || data.userDetails) {
          const user = data.user || data.userDetails;
          populateUserDetails(user);
        } else if (data.success && data.data) {
          populateUserDetails(data.data);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);

        const savedUserData = localStorage.getItem("userData");
        if (savedUserData) {
          const userData = JSON.parse(savedUserData);
          populateUserDetails(userData);
        }
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  // ✅ Updated Helper function to populate saved user details
  const populateUserDetails = (userData) => {
    const nameParts = userData.name ? userData.name.split(" ") : ["", ""];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const details = {
      firstName: firstName || userData.firstName || "",
      lastName: lastName || userData.lastName || "",
      email: userData.email || "",
      phone: userData.phone || "",
    };

    // ✅ Store as saved details (read-only)
    setSavedUserDetails(details);
    setUseSavedUserDetails(true);
  };

  // Fetch Addresses from Checkout API
  useEffect(() => {
    const fetchAddresses = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(`${BACKEND_URL}/api/checkout/addresses`, {
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

        let addressList = [];
        if (data.addresses) {
          addressList = data.addresses;
        } else if (data.data) {
          addressList = data.data;
        } else if (Array.isArray(data)) {
          addressList = data;
        }

        if (addressList.length > 0) {
          setSavedAddresses(addressList);

          const defaultAddress = addressList.find(
            (addr) => addr.isDefault || addr.is_default || addr.default
          );

          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id || defaultAddress._id);
          } else {
            setSelectedAddressId(addressList[0].id || addressList[0]._id);
          }
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  // Check if cart is empty
  useEffect(() => {
    if (!cartLoading && cart.length === 0) {
      showToast("Your cart is empty!");
    }
  }, [cart, cartLoading]);

  // Calculate totals
  const subtotal = totalPrice;
  const shipping = subtotal > 1000 && subtotal < 7000 ? 0 : 100;
  const tax = 0;
  const total = subtotal + shipping + tax;

  // ✅ Updated Validation
  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      // ✅ Check if using saved or new details
      if (useNewUserDetails || showNewUserDetails) {
        // Validate new user details
        if (!newUserDetails.firstName.trim())
          newErrors.firstName = "First name is required";
        if (!newUserDetails.email.trim()) newErrors.email = "Email is required";
        if (!newUserDetails.phone.trim())
          newErrors.phone = "Phone number is required";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (newUserDetails.email && !emailRegex.test(newUserDetails.email)) {
          newErrors.email = "Invalid email format";
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (
          newUserDetails.phone &&
          !phoneRegex.test(newUserDetails.phone.replace(/\s/g, ""))
        ) {
          newErrors.phone = "Invalid phone number (10 digits required)";
        }
      } else if (!useSavedUserDetails && !savedUserDetails.email) {
        newErrors.userDetails = "Please select your details or add new";
      }
    }

    if (currentStep === 2) {
      if (useNewAddress || showNewAddress) {
        if (!newAddress.area.trim()) newErrors.area = "Area is required";
        if (!newAddress.town_city.trim())
          newErrors.town_city = "City is required";
        if (!newAddress.state.trim()) newErrors.state = "State is required";
        if (!newAddress.country.trim())
          newErrors.country = "Country is required";
        if (!newAddress.pincode.trim())
          newErrors.pincode = "Pincode is required";

        if (newAddress.pincode && !/^[0-9]{6}$/.test(newAddress.pincode)) {
          newErrors.pincode = "Invalid pincode (6 digits required)";
        }
      } else if (!selectedAddressId) {
        newErrors.address = "Please select or add an address";
      }
    }

    if (currentStep === 3) {
      if (paymentData.method === "card") {
        if (!paymentData.cardNumber.trim())
          newErrors.cardNumber = "Card number is required";
        if (!paymentData.cardName.trim())
          newErrors.cardName = "Cardholder name is required";
        if (!paymentData.expiry.trim()) newErrors.expiry = "Expiry is required";
        if (!paymentData.cvv.trim()) newErrors.cvv = "CVV is required";

        if (
          paymentData.cardNumber &&
          !/^[0-9]{16}$/.test(paymentData.cardNumber.replace(/\s/g, ""))
        ) {
          newErrors.cardNumber = "Invalid card number (16 digits required)";
        }

        if (paymentData.cvv && !/^[0-9]{3,4}$/.test(paymentData.cvv)) {
          newErrors.cvv = "Invalid CVV (3-4 digits required)";
        }
      } else if (paymentData.method === "upi") {
        if (!paymentData.upiId.trim()) newErrors.upiId = "UPI ID is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
        setErrors({});
      } else {
        handlePlaceOrder();
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  // ✅ Updated Handle Place Order
  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      // ✅ Get final user details (saved or new)
      const finalUserDetails = useNewUserDetails
        ? newUserDetails
        : savedUserDetails;

      // ✅ Get selected address with priority to new address
      let deliveryAddress;

      if (useNewAddress && newAddress.area) {
        deliveryAddress = newAddress;
      } else if (selectedAddressId) {
        deliveryAddress = savedAddresses.find(
          (a) => (a.id || a._id) === selectedAddressId
        );
      }

      if (!deliveryAddress) {
        alert("Please select a delivery address");
        setLoading(false);
        return;
      }

      // Prepare order data
      const orderData = {
        user: {
          ...finalUserDetails,
          fullName: `${finalUserDetails.firstName} ${finalUserDetails.lastName}`,
        },
        address: deliveryAddress,
        payment: paymentData,
        items: cart,
        subtotal,
        shipping,
        tax,
        total,
        totalItems,
      };

      const token = localStorage.getItem("token");

      if (paymentData.method === "onlinePayment") {
        await handleRazorpayPayment(orderData, token);
      } else if (paymentData.method === "cod") {
        await handleCODPayment(orderData, token);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert(error.message || "Failed to place order. Please try again.");
      setLoading(false);
    }
  };

  // Handle Cash on Delivery Payment
  const handleCODPayment = async (orderData, token) => {
    try {
      setLoading(true);

      const response = await fetch(`${BACKEND_URL}/api/orders/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...orderData,
          payment_method: "cod",
          payment_status: "pending",
          subtotal: subtotal,
          shipping: shipping,
          total: total,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to place order");
      }

      const result = await response.json();

      if (result.success) {
        await clearCart();

        navigate("/order-success", {
          state: {
            orderId: result.orderId || result.order_id,
            orderNumber: result.orderNumber || result.order_number,
            paymentMethod: "Cash on Delivery",
            paymentStatus: "Pending",
            total: total,
            subtotal: subtotal,
            shipping: shipping,
            items: cart,
          },
          replace: true,
        });

        setLoading(false);
      } else {
        throw new Error(result.message || "Failed to place order");
      }
    } catch (error) {
      setLoading(false);
      showToast(error.message || "Failed to place order");
      throw error;
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      setIsProcessing(true);
      setLoading(true);

      if (cart.length === 0) {
        showToast("Cart is empty!");
        setIsProcessing(false);
        setLoading(false);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        showToast("Razorpay SDK failed to load. Check your internet!");
        setIsProcessing(false);
        setLoading(false);
        return;
      }

      const finalSubtotal = subtotal;
      const finalShipping = shipping;
      const finalTotal = total;

      // ✅ Get user details
      const finalUserDetails = useNewUserDetails
        ? newUserDetails
        : savedUserDetails;

      let deliveryAddress;
      if (useNewAddress && newAddress.area) {
        deliveryAddress = newAddress;
      } else if (selectedAddressId) {
        deliveryAddress = savedAddresses.find(
          (a) => (a.id || a._id) === selectedAddressId
        );
      }

      if (!deliveryAddress) {
        showToast("Please select a delivery address");
        setIsProcessing(false);
        setLoading(false);
        return;
      }

      console.log("📦 Creating Razorpay order...");
      const orderData = await createRazorpayOrder(finalTotal);

      if (!orderData.success) {
        showToast("Failed to create order!");
        setIsProcessing(false);
        setLoading(false);
        return;
      }

      console.log("✅ Razorpay order created:", orderData.order.id);

      const orderItems = cart.map((item) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        category_name: item.category_name,
        primary_image: item.primary_image,
        price: item.price,
        quantity: item.quantity,
        selectedSize: item.selectedSize || "One Size",
      }));

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "SLNS Sarees",
        description: "Purchase from SLNS Sarees",
        image: "/logo.png",
        order_id: orderData.order.id,

        handler: async function (response) {
          try {
            console.log("💳 Payment successful, verifying...");

            const verificationData = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!verificationData.success) {
              showToast("Payment verification failed!");
              setIsProcessing(false);
              setLoading(false);
              return;
            }

            console.log("✅ Payment verified, placing order...");

            const placeOrderData = await placeOrder({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              items: orderItems,
              total: finalTotal,
              subtotal: finalSubtotal,
              shipping: finalShipping,
              user: {
                ...finalUserDetails,
                fullName: `${finalUserDetails.firstName} ${finalUserDetails.lastName}`,
              },
              address: deliveryAddress,
            });

            if (!placeOrderData.success) {
              showToast("Failed to create order!");
              setIsProcessing(false);
              setLoading(false);
              return;
            }

            console.log("✅ Order placed successfully!");

            await clearCart();

            showToast("Payment Successful! 🎉");

            setTimeout(() => {
              console.log("🚀 Navigating to order success page...");

              navigate("/order-success", {
                state: {
                  orderId:
                    placeOrderData.order?.order_id || placeOrderData.orderId,
                  orderNumber:
                    placeOrderData.order?.order_number ||
                    placeOrderData.orderNumber,
                  paymentId: response.razorpay_payment_id,
                  paymentStatus: "Success",
                  paymentMethod: "Online Payment",
                  orderDate:
                    placeOrderData.order?.created_at ||
                    new Date().toISOString(),
                  total: finalTotal,
                  subtotal: finalSubtotal,
                  shipping: finalShipping,
                  items: orderItems,
                },
                replace: true,
              });

              setIsProcessing(false);
              setLoading(false);
            }, 500);
          } catch (error) {
            console.error("❌ Order processing error:", error);
            showToast(
              error.message || "Something went wrong! Please contact support."
            );
            setIsProcessing(false);
            setLoading(false);
          }
        },

        prefill: {
          name: `${finalUserDetails.firstName} ${finalUserDetails.lastName}`,
          email: finalUserDetails.email,
          contact: finalUserDetails.phone,
        },

        notes: {
          cart_items: cart.length,
          total_amount: finalTotal,
        },

        theme: {
          color: "#815a37",
        },

        modal: {
          ondismiss: function () {
            console.log("❌ Payment cancelled by user");
            setIsProcessing(false);
            setLoading(false);
            showToast("Payment cancelled!");
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("❌ Checkout error:", error);
      showToast(error.message || "Failed to initiate checkout!");
      setIsProcessing(false);
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "User Details", icon: User },
    { number: 2, title: "Address", icon: MapPin },
    { number: 3, title: "Payment", icon: CreditCard },
    { number: 4, title: "Review", icon: ShieldCheck },
  ];

  if (profileLoading || (cartLoading && cart.length === 0)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center mt-20">
        <div className="text-center">
          <Loader className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg font-body">Loading checkout...</p>
        </div>
      </div>
    );
  }

  const isMobile = window.innerWidth <= 480;

  return (
    <div className="min-h-screen bg-black font-body py-12 px-4 mt-20">
      <Link
        to={"/cart"}
        aria-label="Go to product details"
        title="Go to Product"
        className="absolute top-[90px] left-5 md:top-[130px] lg:top-[154px] md:left-[30px] lg:left-[100px] z-20 group inline-flex items-center justify-center rounded-full border border-neutral-700 bg-black p-2 text-gray-300 hover:text-white hover:border-gray-500 focus:outline-none backdrop-blur"
      >
        <div>
          <FaArrowLeft className="text-white text-[12px] md:text-[18px]" />
        </div>
      </Link>
      <div className="max-w-6xl mx-auto ">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-[25px] md:text-5xl font-bold text-white md:mb-3 font-heading tracking-tight">
            Secure Checkout
          </h1>
          <p className="text-white/60 text-[10px] md:text-base">
            Complete your purchase in few simple steps
            <span className="ml-2 text-[#8E6740]">
              ({totalItems} {totalItems === 1 ? "item" : "items"})
            </span>
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between ml-6 md:ml-auto max-w-3xl mx-auto md:px-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center font-semibold transition-all duration-500 transform
                        ${
                          currentStep >= step.number
                            ? "bg-linear-to-br from-[#8E6740] to-[#6b4e2f] text-white shadow-md shadow-[#8E6740]/50 scale-110"
                            : "bg-linear-to-br from-white/10 via-black/10 to-white/10 border border-white/20 text-white"
                        }`}
                    >
                      {currentStep > step.number ? (
                        <Check
                          size={isMobile ? 18 : 24}
                          className="animate-scaleIn"
                        />
                      ) : (
                        <Icon size={isMobile ? 18 : 24} />
                      )}
                    </div>
                    <span
                      className={`text-[9px] md:text-sm mt-2 md:mt-3 font-medium transition-colors duration-300 whitespace-nowrap
                      ${
                        currentStep >= step.number
                          ? "text-[#8E6740]"
                          : "text-white/50"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-1 mx-2 md:mx-4 rounded-full bg-linear-to-br from-white/40 via-black/10 border border-white/20  overflow-hidden">
                      <div
                        className={`h-full transition-all duration-700 ease-in-out rounded-full
                          ${
                            currentStep > step.number
                              ? "w-full bg-gradient-to-r from-[#8E6740] to-[#6b4e2f]"
                              : "w-0 bg-white/50"
                          }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Side - Form */}
          <div className="lg:col-span-2">
            <div className="bg-linear-to-br from-white/5 via-black/10 to-white/5 border border-white/20  rounded-3xl p-5 md:p-10 transition-all duration-500">
              {/* ✅ STEP 1: USER DETAILS - COMPLETELY REDESIGNED */}
              {currentStep === 1 && (
                <div className="space-y-4 md:space-y-6 animate-slideInLeft">
                  <div className="flex items-center gap-1 md:gap-3 mb-3 md:mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#8E6740]/20 flex items-center justify-center">
                      <User
                        className="text-[#8E6740]"
                        size={isMobile ? 15 : 20}
                      />
                    </div>
                    <h2 className="text-md md:text-2xl font-bold text-white">
                      Personal Information
                    </h2>
                  </div>

                  {errors.userDetails && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-2 md:p-4 mb-2 md:mb-4">
                      <p className="text-red-400 text-[8px] md:text-sm flex items-center gap-2">
                        ⚠️ {errors.userDetails}
                      </p>
                    </div>
                  )}

                  {!showNewUserDetails ? (
                    <>
                      {/* ✅ Saved User Details Card (if exists) */}
                      {savedUserDetails.email && (
                        <>
                          <div className="bg-[#8E6740]/10 border border-[#8E6740]/30 rounded-xl p-2 md:p-4 mb-2 md:mb-4">
                            <p className="text-[#8E6740] text-[8px] md:text-sm flex items-center gap-2">
                              <Check size={16} />
                              Your saved information
                            </p>
                          </div>

                          <div
                            onClick={() => {
                              setUseSavedUserDetails(true);
                              setUseNewUserDetails(false);
                            }}
                            className={`group p-3 md:p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02]
                            ${
                              useSavedUserDetails && !useNewUserDetails
                                ? "border-[#8E6740] bg-linear-to-l from-white/10 to-black/10 shadow-lg shadow-[#8E6740]/20"
                                : "border-gray-700 bg-black/30 hover:border-gray-600"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-1 md:gap-3">
                                <div
                                  className={`w-5 h-5 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-colors
                                ${
                                  useSavedUserDetails && !useNewUserDetails
                                    ? "bg-[#8E6740] text-white"
                                    : "bg-white/50 text-gray-400"
                                }`}
                                >
                                  <User size={isMobile ? 12 : 18} />
                                </div>
                                <div>
                                  <span className="font-semibold capitalize text-white text-[12px] md:text-lg">
                                    Your Profile
                                  </span>
                                  <p className="text-[10px] md:text-xs text-gray-400 mt-0.5">
                                    Saved information
                                  </p>
                                </div>
                              </div>
                              {useSavedUserDetails && !useNewUserDetails && (
                                <div className="w-5 h-5 md:w-8 md:h-8 rounded-full bg-[#8E6740] flex items-center justify-center animate-scaleIn">
                                  <Check
                                    size={isMobile ? 12 : 16}
                                    className="text-white"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="md:ml-13 space-y-1">
                              <p className="text-[10px] md:text-sm text-white/70 capitalize">
                                <strong className="text-white">Name:</strong>{" "}
                                {savedUserDetails.firstName}{" "}
                                {savedUserDetails.lastName}
                              </p>
                              <p className="text-[10px] md:text-sm text-white/70">
                                <strong className="text-white">Email:</strong>{" "}
                                {savedUserDetails.email}
                              </p>
                              <p className="text-[10px] md:text-sm text-white/70">
                                <strong className="text-white">Phone:</strong>{" "}
                                {savedUserDetails.phone}
                              </p>
                            </div>
                          </div>
                        </>
                      )}

                      {/* ✅ Add New User Details Button */}
                      <button
                        onClick={() => {
                          setShowNewUserDetails(true);
                          setUseSavedUserDetails(false);
                          setUseNewUserDetails(true);
                        }}
                        className="w-full py-4 border-2 border-dashed text-[12px] md:text-[16px] border-white/20 rounded-2xl text-white/70 hover:border-[#8E6740] hover:text-[#8E6740] hover:bg-[#8E6740]/5 transition-all duration-300 flex items-center justify-center gap-3 font-medium group"
                      >
                        <div className="w-5 h-5 md:w-8 md:h-8 rounded-lg bg-white/20 group-hover:bg-[#8E6740]/20 flex items-center justify-center transition-colors">
                          <Plus size={isMobile ? 14 : 18} />
                        </div>
                        Use Different Details
                      </button>
                    </>
                  ) : (
                    <>
                      {/* ✅ New User Details Form */}
                      <div className="space-y-5 animate-slideInRight">
                        <div className="flex justify-between items-center pb-4 border-b border-gray-800">
                          <h3 className="font-semibold text-white text-[12px] md:text-lg">
                            Enter New Details
                          </h3>
                          <button
                            onClick={() => {
                              setShowNewUserDetails(false);
                              setUseNewUserDetails(false);
                              setUseSavedUserDetails(true);
                              setNewUserDetails({
                                firstName: "",
                                lastName: "",
                                email: "",
                                phone: "",
                              });
                            }}
                            className="w-5 h-5 md:w-8 md:h-8 rounded-lg bg-white/20 hover:bg-white/5 text-white hover:text-white transition-all duration-300 p-3 md:p-0 flex items-center justify-center"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
                          <div className="group">
                            <label className="block text-[10px] md:text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-[#8E6740]">
                              First Name *
                            </label>
                            <input
                              type="text"
                              value={newUserDetails.firstName}
                              onChange={(e) => {
                                setNewUserDetails({
                                  ...newUserDetails,
                                  firstName: e.target.value,
                                });
                                setUseNewUserDetails(true);
                              }}
                              className={`w-full p-2 md:px-5 md:py-3.5 capitalize text-[12px] md:text-[16px] bg-black/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] transition-all duration-300 
                              ${
                                errors.firstName
                                  ? "border-red-500 shake"
                                  : "border-white/20 focus:shadow-lg focus:shadow-[#8E6740]/20"
                              }`}
                              placeholder="Enter first name"
                            />
                            {errors.firstName && (
                              <span className="text-red-400 text-[8px] md:text-xs mt-1 block animate-fadeIn">
                                {errors.firstName}
                              </span>
                            )}
                          </div>

                          <div className="group">
                            <label className="block text-[10px] md:text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-[#8E6740]">
                              Last Name (Optional)
                            </label>
                            <input
                              type="text"
                              value={newUserDetails.lastName}
                              onChange={(e) => {
                                setNewUserDetails({
                                  ...newUserDetails,
                                  lastName: e.target.value,
                                });
                                setUseNewUserDetails(true);
                              }}
                              className={`w-full p-2 md:px-5 md:py-3.5 capitalize text-[12px] md:text-[16px] bg-black/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] transition-all duration-300 border-white/20 focus:shadow-lg focus:shadow-[#8E6740]/20`}
                              placeholder="Enter last name"
                            />
                          </div>
                        </div>

                        <div className="group">
                          <label className="block text-[10px] md:text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-[#8E6740]">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            value={newUserDetails.email}
                            onChange={(e) => {
                              setNewUserDetails({
                                ...newUserDetails,
                                email: e.target.value,
                              });
                              setUseNewUserDetails(true);
                            }}
                            className={`w-full p-2 md:px-5 md:py-3.5 text-[12px] md:text-[16px] bg-black/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] transition-all duration-300
                            ${
                              errors.email
                                ? "border-red-500 shake"
                                : "border-white/20 focus:shadow-lg focus:shadow-[#8E6740]/20"
                            }`}
                            placeholder="your.email@example.com"
                          />
                          {errors.email && (
                            <span className="text-red-400 text-[8px] md:text-xs mt-1 block animate-fadeIn">
                              {errors.email}
                            </span>
                          )}
                        </div>

                        <div className="group">
                          <label className="block text-[10px] md:text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-[#8E6740]">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            value={newUserDetails.phone}
                            onChange={(e) => {
                              setNewUserDetails({
                                ...newUserDetails,
                                phone: e.target.value,
                              });
                              setUseNewUserDetails(true);
                            }}
                            className={`w-full p-2 md:px-5 md:py-3.5 capitalize text-[12px] md:text-[16px] bg-black/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] transition-all duration-300
                            ${
                              errors.phone
                                ? "border-red-500 shake"
                                : "border-white/20 focus:shadow-lg focus:shadow-[#8E6740]/20"
                            }`}
                            placeholder="98765 43210"
                          />
                          {errors.phone && (
                            <span className="text-red-400 text-[10px] md:text-xs mt-1 block animate-fadeIn">
                              {errors.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* STEP 2: ADDRESS - SAME AS BEFORE */}
              {currentStep === 2 && (
                <div className="space-y-4 md:space-y-6 animate-slideInLeft">
                  <div className="flex items-center gap-1 md:gap-3 mb-3 md:mb-6">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#8E6740]/20 flex items-center justify-center">
                      <MapPin
                        className="text-[#8E6740]"
                        size={isMobile ? 15 : 20}
                      />
                    </div>
                    <h2 className="text-md md:text-2xl font-bold text-white">
                      Delivery Address
                    </h2>
                  </div>

                  {errors.address && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-2 md:p-4 mb-2 md:mb-4">
                      <p className="text-red-400 text-[8px] md:text-sm flex items-center gap-2">
                        ⚠️ {errors.address}
                      </p>
                    </div>
                  )}

                  {!showNewAddress ? (
                    <>
                      {savedAddresses.length > 0 && (
                        <>
                          <div className="bg-[#8E6740]/10 border border-[#8E6740]/30 rounded-xl p-2 md:p-4 mb-2 md:mb-4">
                            <p className="text-[#8E6740] text-[8px] md:text-sm flex items-center gap-2">
                              <Check size={16} />
                              {savedAddresses.length} saved{" "}
                              {savedAddresses.length === 1
                                ? "address"
                                : "addresses"}{" "}
                              found
                            </p>
                          </div>

                          <div className="grid grid-cols-1 gap-3 md:gap-4">
                            {savedAddresses.map((addr) => {
                              const addressId = addr.id || addr._id;
                              const isDefault =
                                addr.isDefault ||
                                addr.is_default ||
                                addr.default;

                              return (
                                <div
                                  key={addressId}
                                  onClick={() => {
                                    setSelectedAddressId(addressId);
                                    setUseNewAddress(false);
                                    setNewAddress({
                                      type: "home",
                                      address: "",
                                      area: "",
                                      landmark: "",
                                      town_city: "",
                                      state: "",
                                      country: "India",
                                      pincode: "",
                                    });
                                  }}
                                  className={`group p-3 md:p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02]
                            ${
                              selectedAddressId === addressId && !useNewAddress
                                ? "border-[#8E6740] bg-linear-to-l from-white/10 to-black/10 shadow-lg shadow-[#8E6740]/20"
                                : "border-gray-700 bg-black/30 hover:border-gray-600"
                            }`}
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-1 md:gap-3">
                                      <div
                                        className={`w-5 h-5 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-colors
                                ${
                                  selectedAddressId === addressId &&
                                  !useNewAddress
                                    ? "bg-[#8E6740] text-white"
                                    : "bg-white/50 text-gray-400"
                                }`}
                                      >
                                        <Home size={isMobile ? 12 : 18} />
                                      </div>
                                      <div>
                                        <span className="font-semibold capitalize text-white text-[12px] md:text-lg">
                                          {addr.type || "Home"}
                                        </span>
                                        {isDefault && (
                                          <p className="text-[10px] md:text-xs text-gray-400 mt-0.5">
                                            Default address
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    {selectedAddressId === addressId &&
                                      !useNewAddress && (
                                        <div className="w-5 h-5 md:w-8 md:h-8 rounded-full bg-[#8E6740] flex items-center justify-center animate-scaleIn">
                                          <Check
                                            size={isMobile ? 12 : 16}
                                            className="text-white"
                                          />
                                        </div>
                                      )}
                                  </div>
                                  <div className="md:ml-13 space-y-1">
                                    <p className="text-[10px] md:text-sm text-white/70 capitalize">
                                      {addr.area && `${addr.area}, `}
                                      {addr.landmark && `${addr.landmark}, `}
                                      {addr.town_city && `${addr.town_city}, `}
                                      {addr.state && `${addr.state}, `}
                                      {addr.country && `${addr.country} - `}
                                      {addr.pincode}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}

                      <button
                        onClick={() => {
                          setShowNewAddress(true);
                          setSelectedAddressId(null);
                          setUseNewAddress(true);
                        }}
                        className="w-full py-4 border-2 border-dashed text-[12px] md:text-[16px] border-white/20 rounded-2xl text-white/70 hover:border-[#8E6740] hover:text-[#8E6740] hover:bg-[#8E6740]/5 transition-all duration-300 flex items-center justify-center gap-3 font-medium group"
                      >
                        <div className="w-5 h-5 md:w-8 md:h-8 rounded-lg bg-white/20 group-hover:bg-[#8E6740]/20 flex items-center justify-center transition-colors">
                          <Plus size={isMobile ? 14 : 18} />
                        </div>
                        Add New Address
                      </button>
                    </>
                  ) : (
                    <div className="space-y-5 animate-slideInRight">
                      <div className="flex justify-between items-center pb-4 border-b border-gray-800">
                        <h3 className="font-semibold text-white text-[12px] md:text-lg">
                          Add New Address
                        </h3>
                        <button
                          onClick={() => {
                            setShowNewAddress(false);
                            setUseNewAddress(false);
                            if (savedAddresses.length > 0) {
                              setSelectedAddressId(
                                savedAddresses[0].id || savedAddresses[0]._id
                              );
                            }
                          }}
                          className="w-5 h-5 md:w-8 md:h-8 rounded-lg bg-white/20 hover:bg-white/5 text-white hover:text-white transition-all duration-300 p-3 md:p-0 flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="flex gap-2 md:gap-4">
                        {["home", "work", "other"].map((type) => (
                          <label key={type} className="flex-1 relative">
                            <input
                              type="radio"
                              name="type"
                              value={type}
                              checked={newAddress.type === type}
                              onChange={(e) => {
                                setNewAddress({
                                  ...newAddress,
                                  type: e.target.value,
                                });
                                setUseNewAddress(true);
                              }}
                              className="peer sr-only"
                            />
                            <div className="flex items-center gap-1 md:gap-3 p-2 md:p-4 text-[12px] md:text-[14px] border-2 rounded-xl cursor-pointer transition-all duration-300 peer-checked:border-[#8E6740] peer-checked:bg-[#8E6740]/10 border-white/20 bg-black/30 hover:border-white/30">
                              <Home
                                size={isMobile ? 13 : 18}
                                className="text-gray-400"
                              />
                              <span className="text-gray-300 font-medium capitalize">
                                {type}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="Area / Locality *"
                          value={newAddress.area}
                          onChange={(e) => {
                            setNewAddress({
                              ...newAddress,
                              area: e.target.value,
                            });
                            setUseNewAddress(true);
                          }}
                          className={`w-full p-2 md:px-5 md:py-3.5 text-[12px] md:text-[14px] capitalize bg-black/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] transition-all duration-300
                        ${
                          errors.area
                            ? "border-red-500"
                            : "border-white/20 focus:shadow-lg focus:shadow-[#8E6740]/20"
                        }`}
                        />
                        {errors.area && (
                          <span className="text-red-400 text-[8px] md:text-xs mt-1 block">
                            {errors.area}
                          </span>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder="Landmark (Optional)"
                        value={newAddress.landmark}
                        onChange={(e) => {
                          setNewAddress({
                            ...newAddress,
                            landmark: e.target.value,
                          });
                          setUseNewAddress(true);
                        }}
                        className="w-full p-2 md:px-5 md:py-3.5 text-[12px] md:text-[14px] capitalize bg-black/50 border-2 border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] transition-all duration-300"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <input
                            type="text"
                            placeholder="Town / City *"
                            value={newAddress.town_city}
                            onChange={(e) => {
                              setNewAddress({
                                ...newAddress,
                                town_city: e.target.value,
                              });
                              setUseNewAddress(true);
                            }}
                            className={`w-full p-2 md:px-5 md:py-3.5 text-[12px] md:text-[14px] capitalize bg-black/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] transition-all duration-300
                          ${
                            errors.town_city
                              ? "border-red-500"
                              : "border-white/20 focus:shadow-lg focus:shadow-[#8E6740]/20"
                          }`}
                          />
                          {errors.town_city && (
                            <span className="text-red-400 text-xs mt-1 block">
                              {errors.town_city}
                            </span>
                          )}
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="State *"
                            value={newAddress.state}
                            onChange={(e) => {
                              setNewAddress({
                                ...newAddress,
                                state: e.target.value,
                              });
                              setUseNewAddress(true);
                            }}
                            className={`w-full p-2 md:px-5 md:py-3.5 text-[12px] md:text-[14px] capitalize bg-black/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] transition-all duration-300
                          ${
                            errors.state
                              ? "border-red-500"
                              : "border-white/20 focus:shadow-lg focus:shadow-[#8E6740]/20"
                          }`}
                          />
                          {errors.state && (
                            <span className="text-red-400 text-xs mt-1 block">
                              {errors.state}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <input
                            type="text"
                            placeholder="Country *"
                            value={newAddress.country}
                            onChange={(e) => {
                              setNewAddress({
                                ...newAddress,
                                country: e.target.value,
                              });
                              setUseNewAddress(true);
                            }}
                            className={`w-full p-2 md:px-5 md:py-3.5 text-[12px] md:text-[14px] capitalize bg-black/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] transition-all duration-300
                          ${
                            errors.country
                              ? "border-red-500"
                              : "border-white/20 focus:shadow-lg focus:shadow-[#8E6740]/20"
                          }`}
                          />
                          {errors.country && (
                            <span className="text-red-400 text-xs mt-1 block">
                              {errors.country}
                            </span>
                          )}
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="Pincode *"
                            maxLength="6"
                            value={newAddress.pincode}
                            onChange={(e) => {
                              setNewAddress({
                                ...newAddress,
                                pincode: e.target.value,
                              });
                              setUseNewAddress(true);
                            }}
                            className={`w-full p-2 md:px-5 md:py-3.5 text-[12px] md:text-[14px] capitalize bg-black/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] transition-all duration-300
                          ${
                            errors.pincode
                              ? "border-red-500"
                              : "border-white/20 focus:shadow-lg focus:shadow-[#8E6740]/20"
                          }`}
                          />
                          {errors.pincode && (
                            <span className="text-red-400 text-xs mt-1 block">
                              {errors.pincode}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="space-y-4 md:space-y-6 animate-slideInLeft">
                  <div className="flex items-center gap-1 md:gap-3 mb-3 md:mb-6">
                    <div className="w-7 h-7 md:w-10 md:h-10 rounded-xl bg-[#8E6740]/20 flex items-center justify-center">
                      <CreditCard
                        className="text-[#8E6740]"
                        size={isMobile ? 15 : 20}
                      />
                    </div>
                    <h2 className="text-md md:text-2xl font-bold text-white">
                      Payment Method
                    </h2>
                  </div>

                  <div className="space-y-3 md:space-y-4">
                    <label className="relative block group cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="onlinePayment"
                        checked={paymentData.method === "onlinePayment"}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            method: e.target.value,
                          })
                        }
                        className="peer sr-only"
                      />
                      <div
                        className={`flex items-center p-3 md:p-5 border-2 rounded-2xl transition-all duration-300 peer-checked:border-[#8E6740] peer-checked:bg-linear-to-br peer-checked:from-[#8E6740]/20 peer-checked:to-transparent border-white/20 bg-black/30 hover:border-accet/50 peer-checked:shadow-lg peer-checked:shadow-[#8E6740]/20`}
                      >
                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-md md:rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mr-4">
                          <MdPayment className="text-white" size={20} />
                        </div>
                        <div className="flex-1">
                          <span className="text-white font-semibold text-[13px] md:text-lg block">
                            Online Payment
                          </span>
                          <span className="text-gray-400 text-[10px] md:text-xs">
                            UPI, Credit/Debit Cards, Net Banking
                          </span>
                        </div>
                        {paymentData.method === "onlinePayment" && (
                          <Check
                            size={isMobile ? 15 : 20}
                            className="text-[#8E6740] animate-scaleIn"
                          />
                        )}
                      </div>
                    </label>

                    <label className="relative block group cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentData.method === "cod"}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            method: e.target.value,
                          })
                        }
                        className="peer sr-only"
                      />
                      <div
                        className={`flex items-center p-3 md:p-5 border-2 rounded-2xl transition-all duration-300 peer-checked:border-[#8E6740] peer-checked:bg-linear-to-br peer-checked:from-[#8E6740]/20 peer-checked:to-transparent border-white/20 bg-black/30 hover:border-accet/50 peer-checked:shadow-lg peer-checked:shadow-[#8E6740]/20`}
                      >
                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-md md:rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mr-4">
                          <Truck className="text-white" size={20} />
                        </div>
                        <div className="flex-1">
                          <span className="text-white font-semibold text-[13px] md:text-lg block">
                            Cash on Delivery
                          </span>
                          <span className="text-gray-400 text-[10px] md:text-xs">
                            Pay when you receive
                          </span>
                        </div>
                        {paymentData.method === "cod" && (
                          <Check
                            size={isMobile ? 15 : 20}
                            className="text-[#8E6740] animate-scaleIn"
                          />
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* ✅ STEP 4: REVIEW - UPDATED USER INFO DISPLAY */}
              {currentStep === 4 && (
                <div className="space-y-4 md:space-y-6 animate-slideInLeft">
                  <div className="flex items-center gap-1 md:gap-3 mb-3 md:mb-6">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#8E6740]/20 flex items-center justify-center">
                      <ShieldCheck
                        className="text-[#8E6740]"
                        size={isMobile ? 15 : 20}
                      />
                    </div>
                    <h2 className="text-md md:text-2xl font-bold text-white">
                      Order Review
                    </h2>
                  </div>

                  {/* Order Items */}
                  <div className="rounded-2xl p-6 bg-linear-to-tl from-white/5 to-black/20 border border-white/20 ">
                    <div className="flex items-center gap-3 mb-4">
                      <Package
                        className="text-[#8E6740]"
                        size={isMobile ? 15 : 20}
                      />
                      <h3 className="font-semibold text-white text-[12px] md:text-lg">
                        Order Items ({totalItems})
                      </h3>
                    </div>
                    <div className="space-y-2 md:space-y-3">
                      {cart.map((item) => (
                        <div
                          key={item.product_id}
                          className="flex justify-between items-center py-3 border-b border-gray-800 last:border-0"
                        >
                          <div className="flex items-center gap-2 md:gap-4">
                            <img
                              src={getImageUrl(item.primary_image)}
                              alt={item.product_name}
                              className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover"
                            />
                            <div className="w-full max-w-[80%] overflow-hidden">
                              <span className="text-white text-[13px] md:text-[16px] capitalize w-full font-medium leading-none line-clamp-1">
                                {item.product_name}
                              </span>
                              <span className="text-white/60 text-[10px] md:text-[12px] leading-none">
                                QTY : {item.quantity}
                              </span>
                              <div className="text-white/60 font-body text-[10px] md:text-[12px] leading-none ">
                                Size : {item.size || item.selectedSize}
                              </div>
                            </div>
                          </div>
                          <span className="font-semibold text-white">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Price Breakdown */}
                    <div className="border-t md:border-t-2 border-white/20 mt-2 md:mt-4 pt-2 md:pt-4 space-y-2 md:space-y-3">
                      <div className="flex justify-between text-[12px] md:text-sm">
                        <span className="text-white/80">Subtotal</span>
                        <span className="text-white/80 font-medium">
                          ₹{subtotal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-[12px] md:text-sm">
                        <span className="text-white/80">Shipping</span>
                        <span className="text-white/80 font-medium">
                          ₹{shipping}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t md:border-t-2 border-white/20">
                        <span className="text-white font-bold text-[16px] md:text-lg">
                          Total
                        </span>
                        <span className="text-white font-bold text-[16px] md:text-2xl">
                          ₹{total.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ✅ Delivery Info - UPDATED USER INFO DISPLAY */}
                  <div className="border border-white/20 rounded-2xl p-4 md:p-6 bg-linear-to-br from-white/5 to-black/20">
                    <div className="flex items-center gap-2 md:gap-3 mb-4">
                      <MapPin
                        className="text-[#8E6740]"
                        size={isMobile ? 15 : 20}
                      />
                      <h3 className="font-semibold text-white text-[14px] md:text-lg">
                        Delivery Information
                      </h3>
                    </div>
                    <div className="space-y-1 md:space-y-2">
                      {/* ✅ Show user info based on selection */}
                      {useNewUserDetails ? (
                        <div>
                          <div className="mb-2 p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <p className="text-blue-400 text-[10px] md:text-xs flex items-center gap-1">
                              <Check size={12} />
                              Using new information
                            </p>
                          </div>
                          <p className="text-gray-200 font-medium capitalize">
                            {newUserDetails.firstName} {newUserDetails.lastName}
                          </p>
                          <p className="text-[10px] md:text-sm text-gray-400">
                            {newUserDetails.email}
                          </p>
                          <p className="text-[10px] md:text-sm text-gray-400">
                            {newUserDetails.phone}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <div className="mb-2 p-2 bg-[#8E6740]/10 border border-[#8E6740]/30 rounded-lg">
                            <p className="text-[#8E6740] text-[10px] md:text-xs flex items-center gap-1">
                              <Check size={12} />
                              Using saved information
                            </p>
                          </div>
                          <p className="text-gray-200 font-medium capitalize">
                            {savedUserDetails.firstName}{" "}
                            {savedUserDetails.lastName}
                          </p>
                          <p className="text-[10px] md:text-sm text-gray-400">
                            {savedUserDetails.email}
                          </p>
                          <p className="text-[10px] md:text-sm text-gray-400">
                            {savedUserDetails.phone}
                          </p>
                        </div>
                      )}

                      {/* ADDRESS DISPLAY LOGIC */}
                      <div className="mt-4 pt-4 border-t border-white/20">
                        {useNewAddress && newAddress.area ? (
                          <div>
                            <p className="text-[10px] md:text-xs text-gray-500 mb-2 uppercase flex items-center gap-2">
                              <Check size={14} className="text-green-500" />
                              {newAddress.type || "Home"} Address (New)
                            </p>
                            <p className="text-[10px] md:text-sm text-gray-300 capitalize leading-relaxed">
                              {newAddress.area && `${newAddress.area}, `}
                              {newAddress.landmark &&
                                `${newAddress.landmark}, `}
                              <br />
                              {newAddress.town_city &&
                                `${newAddress.town_city}, `}
                              {newAddress.state && `${newAddress.state} - `}
                              {newAddress.pincode}
                              <br />
                              {newAddress.country || "India"}
                            </p>
                          </div>
                        ) : selectedAddressId ? (
                          (() => {
                            const selectedAddr = savedAddresses.find(
                              (a) => (a.id || a._id) === selectedAddressId
                            );
                            return selectedAddr ? (
                              <div>
                                <p className="text-[10px] md:text-xs text-gray-500 mb-2 uppercase flex items-center gap-2">
                                  <Check size={14} className="text-green-500" />
                                  {selectedAddr.type || "Home"} Address
                                </p>
                                <p className="text-[10px] md:text-sm text-gray-300 capitalize leading-relaxed">
                                  {selectedAddr.area &&
                                    `${selectedAddr.area}, `}
                                  {selectedAddr.landmark &&
                                    `${selectedAddr.landmark}, `}
                                  <br />
                                  {selectedAddr.town_city &&
                                    `${selectedAddr.town_city}, `}
                                  {selectedAddr.state &&
                                    `${selectedAddr.state} - `}
                                  {selectedAddr.pincode}
                                  <br />
                                  {selectedAddr.country || "India"}
                                </p>
                              </div>
                            ) : (
                              <p className="text-[10px] md:text-sm text-red-400">
                                ⚠️ No address selected
                              </p>
                            );
                          })()
                        ) : (
                          <p className="text-[10px] md:text-sm text-red-400">
                            ⚠️ No address selected
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="border border-white/20 rounded-2xl p-4 md:p-6 bg-linear-to-bl from-white/0 to-black/20">
                    <div className="flex items-center gap-3 mb-4">
                      <CreditCard
                        className="text-[#8E6740]"
                        size={isMobile ? 15 : 20}
                      />
                      <h3 className="font-semibold text-white text-[14px] md:text-lg">
                        Payment Method
                      </h3>
                    </div>
                    <p className="text-gray-300 font-medium text-[10px] md:text-[14px] border border-green-500 bg-green-700/10 p-2 rounded-full flex justify-center">
                      {paymentData.method === "onlinePayment" &&
                        "Online Payment"}
                      {paymentData.method === "cod" && "🚚 Cash on Delivery"}
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-6 md:mt-10 gap-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 text-[10px] md:text-[16px]
                    ${
                      currentStep === 1
                        ? "bg-white/20 text-gray-600 cursor-not-allowed opacity-50"
                        : "bg-linear-to-r from-white/20 to-white/5 text-white hover:from-white/5 hover:to-white/20 shadow-lg"
                    }`}
                >
                  <ChevronLeft size={isMobile ? 15 : 20} />
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  disabled={loading || isProcessing}
                  className="flex items-center gap-2 px-8 py-4 bg-linear-to-r from-[#8E6740]/20 to-[#6b4e2f] text-white rounded-xl font-semibold hover:from-[#6b4e2f] hover:to-[#8E6740]/20 transition-all duration-300 shadow-xl transform hover:scale-105 text-[10px] md:text-[16px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader
                        size={isMobile ? 15 : 20}
                        className="animate-spin"
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      {currentStep === 4 ? "Place Order" : "Next"}
                      <ChevronRight size={isMobile ? 15 : 20} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-linear-to-br from-white/5 via-black/10 to-white/5 border border-white/20  rounded-3xl shadow-2xl p-4 md:p-6 ">
                <h3 className="text-[14px] md:text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Package
                    size={isMobile ? 15 : 20}
                    className="text-[#8E6740]"
                  />
                  Order Summary
                </h3>

                <div className="space-y-2 mb-6 max-h-64 overflow-y-auto custom-scrollbar">
                  {cart.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex justify-between items-start md:p-3 bg-black/30 rounded-xl"
                    >
                      <div className="flex gap-2">
                        <img
                          src={getImageUrl(item.primary_image)}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="max-w-40 text-white/70 font-medium text-[10px] capitalize md:text-[12px] line-clamp-1">
                            {item.product_name}
                          </p>
                          <p className="text-white/30 text-[8px] md:text-xs">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-white font-semibold text-sm">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5 md:space-y-3 py-3 md:py-4 border-t border-b border-white/20">
                  <div className="flex justify-between text-[12px] md:text-sm">
                    <span className="text-white/80">Subtotal</span>
                    <span className="text-white/80">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[12px] md:text-sm">
                    <span className="text-white/80">Shipping</span>
                    <span className="text-white/80">₹{shipping}</span>
                  </div>
                </div>

                <div className="flex justify-between font-body items-center pt-2 md:pt-4">
                  <span className="text-white font-bold text-[16px] md:text-lg">
                    Total
                  </span>
                  <span className="text-[#8E6740] font-bold text-[18px] md:text-2xl">
                    ₹{total.toFixed(0)}
                  </span>
                </div>

                <div className="mt-3 md:mt-6 p-2 md:p-4 bg-[#8E6740]/10 border border-[#8E6740]/30 rounded-xl">
                  <p className="text-[#8E6740] text-[10px] md:text-xs text-center flex items-center justify-center gap-2">
                    <ShieldCheck size={isMobile ? 12 : 16} />
                    Secure checkout with SSL encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #8e6740;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b4e2f;
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.5s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }

        .shake {
          animation: shake 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
