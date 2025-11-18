import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_API_URL;

  // ✅ Form Data
  const [userDetails, setUserDetails] = useState({
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

  // ✅ Fetch User Details from Checkout API
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        // If no token, try to load from localStorage
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

        // ✅ Use checkout API endpoint
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

        // ✅ Auto-populate user details
        if (data.user || data.userDetails) {
          const user = data.user || data.userDetails;
          populateUserDetails(user);
        } else if (data.success && data.data) {
          populateUserDetails(data.data);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);

        // Fallback to localStorage
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

  // ✅ Helper function to populate user details
  const populateUserDetails = (userData) => {
    const nameParts = userData.name ? userData.name.split(" ") : ["", ""];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    setUserDetails({
      firstName: firstName || userData.firstName || "",
      lastName: lastName || userData.lastName || "",
      email: userData.email || "",
      phone: userData.phone || "",
    });
  };

  // ✅ Fetch Addresses from Checkout API
  useEffect(() => {
    const fetchAddresses = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // ✅ Use checkout addresses API endpoint
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

        // ✅ Handle different response formats
        let addressList = [];
        if (data.addresses) {
          addressList = data.addresses;
        } else if (data.data) {
          addressList = data.data;
        } else if (Array.isArray(data)) {
          addressList = data;
        }

        console.log("address", data);

        if (addressList.length > 0) {
          setSavedAddresses(addressList);

          // ✅ Auto-select default address
          const defaultAddress = addressList.find(
            (addr) => addr.isDefault || addr.is_default || addr.default
          );

          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id || defaultAddress._id);
          } else {
            // Select first address if no default
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

  // ✅ Check if cart is empty
  useEffect(() => {
    if (!cartLoading && cart.length === 0) {
      alert("Your cart is empty!");
      navigate("/cart");
    }
  }, [cart, cartLoading, navigate]);

  // ✅ Calculate totals
  const subtotal = totalPrice;
  const shipping = subtotal > 0 ? 99 : 0;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  // Validation
  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!userDetails.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!userDetails.email.trim()) newErrors.email = "Email is required";
      if (!userDetails.phone.trim())
        newErrors.phone = "Phone number is required";

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (userDetails.email && !emailRegex.test(userDetails.email)) {
        newErrors.email = "Invalid email format";
      }

      // Phone validation
      const phoneRegex = /^[0-9]{10}$/;
      if (
        userDetails.phone &&
        !phoneRegex.test(userDetails.phone.replace(/\s/g, ""))
      ) {
        newErrors.phone = "Invalid phone number (10 digits required)";
      }
    }

    if (currentStep === 2) {
      // If no address is selected and not adding new address
      if (!selectedAddressId && !showNewAddress) {
        newErrors.address = "Please select or add an address";
      }

      // Validate new address form if visible
      if (showNewAddress) {
        if (!newAddress.area.trim()) newErrors.area = "Area is required";
        if (!newAddress.town_city.trim())
          newErrors.town_city = "City is required";
        if (!newAddress.state.trim()) newErrors.state = "State is required";
        if (!newAddress.country.trim())
          newErrors.country = "Country is required";
        if (!newAddress.pincode.trim())
          newErrors.pincode = "Pincode is required";

        // Pincode validation
        if (newAddress.pincode && !/^[0-9]{6}$/.test(newAddress.pincode)) {
          newErrors.pincode = "Invalid pincode (6 digits required)";
        }
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

        // Card validation
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

  // ✅ Handle Place Order with Payment Method Logic
  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      // Get selected address
      let deliveryAddress;
      if (selectedAddressId) {
        deliveryAddress = savedAddresses.find(
          (a) => (a.id || a._id) === selectedAddressId
        );
      } else if (showNewAddress) {
        deliveryAddress = newAddress;
      }

      // Prepare order data
      const orderData = {
        user: {
          ...userDetails,
          fullName: `${userDetails.firstName} ${userDetails.lastName}`,
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

      // ✅ Check payment method
      if (paymentData.method === "onlinePayment") {
        // 🔥 RAZORPAY PAYMENT
        await handleRazorpayPayment(orderData, token);
      } else if (paymentData.method === "cod") {
        // 🔥 CASH ON DELIVERY
        await handleCODPayment(orderData, token);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert(error.message || "Failed to place order. Please try again.");
      setLoading(false);
    }
  };

  // ✅ Handle Cash on Delivery Payment
  const handleCODPayment = async (orderData, token) => {
    try {
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
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to place order");
      }

      const result = await response.json();

      if (result.success) {
        // ✅ Show loading for 2 seconds before redirect
        setTimeout(async () => {
          await clearCart();
          setLoading(false);
          navigate("/order-success", {
            state: {
              orderId: result.orderId || result.order_id,
              orderNumber: result.orderNumber || result.order_number,
              paymentMethod: "cod",
            },
          });
        }, 2000); // 2 seconds delay
      } else {
        throw new Error(result.message || "Failed to place order");
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      setIsProcessing(true);

      // 1. Check if cart is empty
      if (cart.length === 0) {
        showToast("Cart is empty!");
        return;
      }

      // 2. Load Razorpay Script
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        showToast("Razorpay SDK failed to load. Check your internet!");
        setIsProcessing(false);
        return;
      }

      // ✅ Calculate amounts BEFORE creating order
      const calculatedSubtotal = cart.reduce(
        (sum, it) => sum + it.price * it.quantity,
        0
      );
      const calculatedShipping =
        calculatedSubtotal > 1000 && calculatedSubtotal < 7000 ? 0 : 100;
      const calculatedTotal = calculatedSubtotal + calculatedShipping;

      // 3. Create Order in Backend
      const orderData = await createRazorpayOrder(calculatedTotal);

      if (!orderData.success) {
        showToast("Failed to create order!");
        setIsProcessing(false);
        return;
      }

      // ✅ Prepare order items BEFORE payment
      const orderItems = cart.map((item) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        category_name: item.category_name,
        primary_image: item.primary_image,
        price: item.price,
        quantity: item.quantity,
        selectedSize: item.selectedSize || "One Size",
      }));

      // 4. Razorpay Options Setup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "SLNS Sarees",
        description: "Purchase from SLNS Sarees",
        image: "/logo.png",
        order_id: orderData.order.id,

        // ✅✅✅ Payment Success Handler - COMPLETELY REWRITTEN
        handler: async function (response) {
          try {
            console.log("💳 Payment successful, processing...");

            // Step 1: Verify payment signature
            const verificationData = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!verificationData.success) {
              showToast("Payment verification failed!");
              setIsProcessing(false);
              return;
            }

            console.log("✅ Payment verified, placing order...");

            // Step 2: Place order in database
            const placeOrderData = await placeOrder({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              items: orderItems,
              total: calculatedTotal,
              subtotal: calculatedSubtotal,
              shipping: calculatedShipping,
            });

            if (!placeOrderData.success) {
              showToast("Failed to create order!");
              setIsProcessing(false);
              setLoading(false);
              return;
            }

            console.log("✅ Order placed successfully!");
            showToast("Payment Successful! 🎉");
            setLoading(false);
            setIsProcessing(false);

            // Step 3: Clear cart
            clearCart();

            // Step 4: Navigate to success page
            navigate("/order-success", {
              state: {
                orderId: placeOrderData.order.order_id,
                orderNumber: placeOrderData.order.order_number,
                paymentId: response.razorpay_payment_id,
                paymentStatus: "Success",
                paymentMethod: "Online Payment",
                orderDate: placeOrderData.order.created_at,
                total: calculatedTotal,
                subtotal: calculatedSubtotal,
                shipping: calculatedShipping,
                items: orderItems,
              },
              replace: true,
            });
          } catch (error) {
            console.error("❌ Order processing error:", error);
            showToast("Something went wrong! Please contact support.");
            setIsProcessing(false);
            setLoading(false);
          }
        },

        // ✅ Customer Details Prefill
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },

        // ✅ Notes
        notes: {
          cart_items: cart.length,
          total_amount: calculatedTotal,
        },

        // ✅ Theme
        theme: {
          color: "#815a37",
        },

        // ✅ Modal Close Handler
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setLoading(false);
            showToast("Payment cancelled!");
          },
        },
      };

      // 5. Open Razorpay Checkout
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Checkout error:", error);
      showToast("Failed to initiate checkout!");
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

  // ✅ Show loading state
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

  return (
    <div className="min-h-screen bg-black font-body py-12 px-4 mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 font-heading tracking-tight">
            Secure Checkout
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Complete your purchase in few simple steps
            <span className="ml-2 text-[#8E6740]">
              ({totalItems} {totalItems === 1 ? "item" : "items"})
            </span>
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-3xl mx-auto md:px-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center font-semibold transition-all duration-500 transform
                        ${
                          currentStep >= step.number
                            ? "bg-gradient-to-br from-[#8E6740] to-[#6b4e2f] text-white shadow-lg shadow-[#8E6740]/50 scale-110"
                            : "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-500 border border-gray-700"
                        }`}
                    >
                      {currentStep > step.number ? (
                        <Check size={24} className="animate-scaleIn" />
                      ) : (
                        <Icon size={24} />
                      )}
                    </div>
                    <span
                      className={`text-xs md:text-sm mt-3 font-medium transition-colors duration-300 whitespace-nowrap
                      ${
                        currentStep >= step.number
                          ? "text-[#8E6740]"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-1 mx-2 md:mx-4 rounded-full bg-gray-800 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-700 ease-in-out rounded-full
                          ${
                            currentStep > step.number
                              ? "w-full bg-gradient-to-r from-[#8E6740] to-[#6b4e2f]"
                              : "w-0 bg-gray-700"
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Form */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-6 md:p-10 border border-gray-800 transition-all duration-500">
              {/* Step 1: User Details */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-slideInLeft">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#8E6740]/20 flex items-center justify-center">
                      <User className="text-[#8E6740]" size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Personal Information
                    </h2>
                  </div>

                  {/* ✅ Show info if auto-populated */}
                  {userDetails.email && (
                    <div className="bg-[#8E6740]/10 border border-[#8E6740]/30 rounded-xl p-4 mb-4">
                      <p className="text-[#8E6740] text-sm flex items-center gap-2">
                        <Check size={16} />
                        Your information has been auto-filled from your profile.
                        You can edit if needed.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-[#8E6740]">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={userDetails.firstName}
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            firstName: e.target.value,
                          })
                        }
                        className={`w-full px-5 py-3.5 bg-black/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] transition-all duration-300 
                      ${
                        errors.firstName
                          ? "border-red-500 shake"
                          : "border-gray-700 focus:shadow-lg focus:shadow-[#8E6740]/20"
                      }`}
                        placeholder="Enter first name"
                      />
                      {errors.firstName && (
                        <span className="text-red-400 text-xs mt-1 block animate-fadeIn">
                          {errors.firstName}
                        </span>
                      )}
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-[#8E6740]">
                        Last Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={userDetails.lastName}
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            lastName: e.target.value,
                          })
                        }
                        className={`w-full px-5 py-3.5 bg-black/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] transition-all duration-300 border-gray-700 focus:shadow-lg focus:shadow-[#8E6740]/20`}
                        placeholder="Enter last name"
                      />
                      {errors.lastName && (
                        <span className="text-red-400 text-xs mt-1 block animate-fadeIn">
                          {errors.lastName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-[#8E6740]">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={userDetails.email}
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          email: e.target.value,
                        })
                      }
                      className={`w-full px-5 py-3.5 bg-black/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] transition-all duration-300
                    ${
                      errors.email
                        ? "border-red-500 shake"
                        : "border-gray-700 focus:shadow-lg focus:shadow-[#8E6740]/20"
                    }`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <span className="text-red-400 text-xs mt-1 block animate-fadeIn">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-[#8E6740]">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={userDetails.phone}
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          phone: e.target.value,
                        })
                      }
                      className={`w-full px-5 py-3.5 bg-black/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] transition-all duration-300
                    ${
                      errors.phone
                        ? "border-red-500 shake"
                        : "border-gray-700 focus:shadow-lg focus:shadow-[#8E6740]/20"
                    }`}
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && (
                      <span className="text-red-400 text-xs mt-1 block animate-fadeIn">
                        {errors.phone}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Address */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-slideInLeft">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#8E6740]/20 flex items-center justify-center">
                      <MapPin className="text-[#8E6740]" size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Delivery Address
                    </h2>
                  </div>

                  {/* ✅ Show error if no address selected */}
                  {errors.address && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
                      <p className="text-red-400 text-sm flex items-center gap-2">
                        ⚠️ {errors.address}
                      </p>
                    </div>
                  )}

                  {!showNewAddress ? (
                    <>
                      {/* ✅ Saved Addresses */}
                      {savedAddresses.length > 0 ? (
                        <>
                          <div className="bg-[#8E6740]/10 border border-[#8E6740]/30 rounded-xl p-4 mb-4">
                            <p className="text-[#8E6740] text-sm flex items-center gap-2">
                              <Check size={16} />
                              {savedAddresses.length} saved{" "}
                              {savedAddresses.length === 1
                                ? "address"
                                : "addresses"}{" "}
                              found
                            </p>
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            {savedAddresses.map((addr) => {
                              const addressId = addr.id || addr._id;
                              const isDefault =
                                addr.isDefault ||
                                addr.is_default ||
                                addr.default;

                              return (
                                <div
                                  key={addressId}
                                  onClick={() =>
                                    setSelectedAddressId(addressId)
                                  }
                                  className={`group p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02]
                            ${
                              selectedAddressId === addressId
                                ? "border-[#8E6740] bg-gradient-to-br from-[#8E6740]/10 to-transparent shadow-lg shadow-[#8E6740]/20"
                                : "border-gray-700 bg-black/30 hover:border-gray-600"
                            }`}
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                                ${
                                  selectedAddressId === addressId
                                    ? "bg-[#8E6740] text-white"
                                    : "bg-gray-800 text-gray-400"
                                }`}
                                      >
                                        <Home size={18} />
                                      </div>
                                      <div>
                                        <span className="font-semibold capitalize text-white text-lg">
                                          {addr.type || "Home"}
                                        </span>
                                        {isDefault && (
                                          <p className="text-xs text-gray-400 mt-0.5">
                                            Default address
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    {selectedAddressId === addressId && (
                                      <div className="w-8 h-8 rounded-full bg-[#8E6740] flex items-center justify-center animate-scaleIn">
                                        <Check
                                          size={16}
                                          className="text-white"
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <div className="ml-13 space-y-1">
                                    <p className="text-sm text-gray-400">
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
                      ) : (
                        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-8 text-center">
                          <MapPin
                            className="mx-auto text-gray-500 mb-3"
                            size={48}
                          />
                          <p className="text-gray-400 text-lg mb-2">
                            No saved addresses found
                          </p>
                          <p className="text-gray-500 text-sm">
                            Add a new address to continue
                          </p>
                        </div>
                      )}

                      <button
                        onClick={() => setShowNewAddress(true)}
                        className="w-full py-4 border-2 border-dashed border-gray-700 rounded-2xl text-gray-400 hover:border-[#8E6740] hover:text-[#8E6740] hover:bg-[#8E6740]/5 transition-all duration-300 flex items-center justify-center gap-3 font-medium group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-800 group-hover:bg-[#8E6740]/20 flex items-center justify-center transition-colors">
                          <Plus size={18} />
                        </div>
                        Add New Address
                      </button>
                    </>
                  ) : (
                    /* New Address Form */
                    <div className="space-y-5 animate-slideInRight">
                      <div className="flex justify-between items-center pb-4 border-b border-gray-800">
                        <h3 className="font-semibold text-white text-lg">
                          Add New Address
                        </h3>
                        <button
                          onClick={() => setShowNewAddress(false)}
                          className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all duration-300 flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="flex gap-4">
                        {["home", "work", "other"].map((type) => (
                          <label key={type} className="flex-1 relative">
                            <input
                              type="radio"
                              name="type"
                              value={type}
                              checked={newAddress.type === type}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  type: e.target.value,
                                })
                              }
                              className="peer sr-only"
                            />
                            <div className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 peer-checked:border-[#8E6740] peer-checked:bg-[#8E6740]/10 border-gray-700 bg-black/30 hover:border-gray-600">
                              <Home size={18} className="text-gray-400" />
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
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              area: e.target.value,
                            })
                          }
                          className={`w-full px-5 py-3.5 bg-black/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] transition-all duration-300
                        ${
                          errors.area
                            ? "border-red-500"
                            : "border-gray-700 focus:shadow-lg focus:shadow-[#8E6740]/20"
                        }`}
                        />
                        {errors.area && (
                          <span className="text-red-400 text-xs mt-1 block">
                            {errors.area}
                          </span>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder="Landmark (Optional)"
                        value={newAddress.landmark}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            landmark: e.target.value,
                          })
                        }
                        className="w-full px-5 py-3.5 bg-black/50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] transition-all duration-300"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <input
                            type="text"
                            placeholder="Town / City *"
                            value={newAddress.town_city}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                town_city: e.target.value,
                              })
                            }
                            className={`w-full px-5 py-3.5 bg-black/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] transition-all duration-300
                          ${
                            errors.town_city
                              ? "border-red-500"
                              : "border-gray-700 focus:shadow-lg focus:shadow-[#8E6740]/20"
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
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                state: e.target.value,
                              })
                            }
                            className={`w-full px-5 py-3.5 bg-black/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] transition-all duration-300
                          ${
                            errors.state
                              ? "border-red-500"
                              : "border-gray-700 focus:shadow-lg focus:shadow-[#8E6740]/20"
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
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                country: e.target.value,
                              })
                            }
                            className={`w-full px-5 py-3.5 bg-black/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] transition-all duration-300
                          ${
                            errors.country
                              ? "border-red-500"
                              : "border-gray-700 focus:shadow-lg focus:shadow-[#8E6740]/20"
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
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                pincode: e.target.value,
                              })
                            }
                            className={`w-full px-5 py-3.5 bg-black/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] transition-all duration-300
                          ${
                            errors.pincode
                              ? "border-red-500"
                              : "border-gray-700 focus:shadow-lg focus:shadow-[#8E6740]/20"
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

              {/* Step 3: Payment - SAME AS BEFORE */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-slideInLeft">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#8E6740]/20 flex items-center justify-center">
                      <CreditCard className="text-[#8E6740]" size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Payment Method
                    </h2>
                  </div>

                  <div className="space-y-4">
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
                        className={`flex items-center p-5 border-2 rounded-2xl transition-all duration-300 peer-checked:border-[#8E6740] peer-checked:bg-gradient-to-br peer-checked:from-[#8E6740]/10 peer-checked:to-transparent border-gray-700 bg-black/30 hover:border-gray-600 peer-checked:shadow-lg peer-checked:shadow-[#8E6740]/20`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mr-4">
                          <MdPayment className="text-white" size={20} />
                        </div>
                        <div className="flex-1">
                          <span className="text-white font-semibold text-lg block">
                            Online Payment
                          </span>
                          <span className="text-gray-400 text-xs">
                            UPI, Credit/Debit Cards, Net Banking
                          </span>
                        </div>
                        {paymentData.method === "onlinePayment" && (
                          <Check
                            size={20}
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
                        className={`flex items-center p-5 border-2 rounded-2xl transition-all duration-300 peer-checked:border-[#8E6740] peer-checked:bg-gradient-to-br peer-checked:from-[#8E6740]/10 peer-checked:to-transparent border-gray-700 bg-black/30 hover:border-gray-600 peer-checked:shadow-lg peer-checked:shadow-[#8E6740]/20`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mr-4">
                          <Truck className="text-white" size={20} />
                        </div>
                        <div className="flex-1">
                          <span className="text-white font-semibold text-lg block">
                            Cash on Delivery
                          </span>
                          <span className="text-gray-400 text-xs">
                            Pay when you receive
                          </span>
                        </div>
                        {paymentData.method === "cod" && (
                          <Check
                            size={20}
                            className="text-[#8E6740] animate-scaleIn"
                          />
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-slideInLeft">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#8E6740]/20 flex items-center justify-center">
                      <ShieldCheck className="text-[#8E6740]" size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Order Review
                    </h2>
                  </div>

                  {/* ✅ Order Items from Cart Context */}
                  <div className="border-2 border-gray-800 rounded-2xl p-6 bg-gradient-to-br from-gray-900/50 to-black/50">
                    <div className="flex items-center gap-3 mb-4">
                      <Package className="text-[#8E6740]" size={20} />
                      <h3 className="font-semibold text-white text-lg">
                        Order Items ({totalItems})
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {/* ✅ Map through cart from context */}
                      {cart.map((item) => (
                        <div
                          key={item.product_id}
                          className="flex justify-between items-center py-3 border-b border-gray-800 last:border-0"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={getImageUrl(item.primary_image)}
                              alt={item.product_name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="w-full max-w-[80%] overflow-hidden">
                              <span className="text-gray-200 w-full font-medium leading-none line-clamp-1">
                                {item.product_name}
                              </span>
                              <span className="text-gray-500 text-[12px] leading-none">
                                QTY : {item.quantity}
                              </span>
                              <div className="text-gray-500 font-body text-[12px] leading-none ">
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
                    <div className="border-t-2 border-gray-800 mt-4 pt-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Subtotal</span>
                        <span className="text-gray-300 font-medium">
                          ₹{subtotal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Shipping</span>
                        <span className="text-gray-300 font-medium">
                          ₹{shipping}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Tax (18%)</span>
                        <span className="text-gray-300 font-medium">
                          ₹{tax.toFixed(0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t-2 border-gray-800">
                        <span className="text-white font-bold text-lg">
                          Total
                        </span>
                        <span className="text-[#8E6740] font-bold text-2xl">
                          ₹{total.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Info - SAME AS BEFORE */}
                  <div className="border-2 border-gray-800 rounded-2xl p-6 bg-gradient-to-br from-gray-900/50 to-black/50">
                    <div className="flex items-center gap-3 mb-4">
                      <MapPin className="text-[#8E6740]" size={20} />
                      <h3 className="font-semibold text-white text-lg">
                        Delivery Information
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-200 font-medium">
                        {userDetails.firstName} {userDetails.lastName}
                      </p>
                      <p className="text-sm text-gray-400">
                        {userDetails.email}
                      </p>
                      <p className="text-sm text-gray-400">
                        {userDetails.phone}
                      </p>
                      {selectedAddressId && (
                        <div className="mt-4 pt-4 border-t border-gray-800">
                          <p className="text-sm text-gray-300 leading-relaxed">
                            {
                              savedAddresses.find(
                                (a) => a.id === selectedAddressId
                              )?.address
                            }
                            ,{" "}
                            {
                              savedAddresses.find(
                                (a) => a.id === selectedAddressId
                              )?.area
                            }
                            <br />
                            {
                              savedAddresses.find(
                                (a) => a.id === selectedAddressId
                              )?.city
                            }
                            ,{" "}
                            {
                              savedAddresses.find(
                                (a) => a.id === selectedAddressId
                              )?.state
                            }{" "}
                            -{" "}
                            {
                              savedAddresses.find(
                                (a) => a.id === selectedAddressId
                              )?.pincode
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Info - SAME AS BEFORE */}
                  <div className="border-2 border-gray-800 rounded-2xl p-6 bg-gradient-to-br from-gray-900/50 to-black/50">
                    <div className="flex items-center gap-3 mb-4">
                      <CreditCard className="text-[#8E6740]" size={20} />
                      <h3 className="font-semibold text-white text-lg">
                        Payment Method
                      </h3>
                    </div>
                    <p className="text-gray-300 font-medium text-[14px] border border-green-500 bg-green-700/10 p-2 rounded-full flex justify-center">
                      {paymentData.method === "onlinePayment" &&
                        "Online Payment"}
                      {paymentData.method === "cod" && "🚚 Cash on Delivery"}
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-10 gap-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105
                    ${
                      currentStep === 1
                        ? "bg-gray-900 text-gray-600 cursor-not-allowed opacity-50"
                        : "bg-gradient-to-r from-gray-800 to-gray-700 text-white hover:from-gray-700 hover:to-gray-600 shadow-lg"
                    }`}
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#8E6740] to-[#6b4e2f] text-white rounded-xl font-semibold hover:from-[#6b4e2f] hover:to-[#8E6740] transition-all duration-300 shadow-lg shadow-[#8E6740]/50 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {currentStep === 4 ? "Place Order" : "Next"}
                      <ChevronRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Package size={20} className="text-[#8E6740]" />
                  Order Summary
                </h3>

                {/* ✅ Cart items from context */}
                <div className="space-y-2 mb-6 max-h-64 overflow-y-auto custom-scrollbar">
                  {cart.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex justify-between items-start p-3 bg-black/30 rounded-xl"
                    >
                      <div className="flex gap-2">
                        <img
                          src={getImageUrl(item.primary_image)}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="max-w-40 text-gray-200 font-medium text-[12px] line-clamp-1">
                            {item.product_name}
                          </p>
                          <p className="text-gray-500 text-xs">
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

                <div className="space-y-3 py-4 border-t border-b border-gray-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-gray-300">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-gray-300">₹{shipping}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tax</span>
                    <span className="text-gray-300">₹{tax.toFixed(0)}</span>
                  </div>
                </div>

                <div className="flex justify-between font-body items-center pt-4">
                  <span className="text-white font-bold text-lg">Total</span>
                  <span className="text-[#8E6740] font-bold text-2xl">
                    ₹{total.toFixed(0)}
                  </span>
                </div>

                <div className="mt-6 p-4 bg-[#8E6740]/10 border border-[#8E6740]/30 rounded-xl">
                  <p className="text-[#8E6740] text-xs text-center flex items-center justify-center gap-2">
                    <ShieldCheck size={16} />
                    Secure checkout with SSL encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations - SAME AS BEFORE */}
      <style jsx>{`
        /* Your existing styles */

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
      `}</style>
    </div>
  );
}
