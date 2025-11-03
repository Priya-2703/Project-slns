import { useState } from "react";
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
} from "lucide-react";

export default function CheckOut() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [showNewAddress, setShowNewAddress] = useState(false);

  // Form Data - Simplified state management
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
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentData, setPaymentData] = useState({
    method: "card",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    upiId: "",
  });

  const [errors, setErrors] = useState({});

  // Saved addresses
  const savedAddresses = [
    {
      id: 1,
      type: "home",
      name: "John Doe",
      phone: "9876543210",
      address: "123, MG Road",
      area: "Koramangala",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560034",
    },
    {
      id: 2,
      type: "home",
      name: "John Doe",
      phone: "9876543211",
      address: "Tech Park, Block A",
      area: "Whitefield",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560066",
    },
  ];

  // Cart calculation
  const cartItems = [
    { id: 1, name: "Product 1", qty: 1, price: 2999 },
    { id: 2, name: "Product 2", qty: 2, price: 1999 },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const shipping = 99;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  // Validation
  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!userDetails.firstName) newErrors.firstName = "Required";
      if (!userDetails.lastName) newErrors.lastName = "Required";
      if (!userDetails.email) newErrors.email = "Required";
      if (!userDetails.phone) newErrors.phone = "Required";
    }

    if (currentStep === 2 && showNewAddress) {
      if (!newAddress.address) newErrors.address = "Required";
      if (!newAddress.area) newErrors.area = "Required";
      if (!newAddress.city) newErrors.city = "Required";
      if (!newAddress.state) newErrors.state = "Required";
      if (!newAddress.pincode) newErrors.pincode = "Required";
    }

    if (currentStep === 3 && paymentData.method === "card") {
      if (!paymentData.cardNumber) newErrors.cardNumber = "Required";
      if (!paymentData.cardName) newErrors.cardName = "Required";
      if (!paymentData.expiry) newErrors.expiry = "Required";
      if (!paymentData.cvv) newErrors.cvv = "Required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        handlePlaceOrder();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = () => {
    console.log("Order placed!");
    alert("Order placed successfully!");
  };

  const steps = [
    { number: 1, title: "User Details", icon: User },
    { number: 2, title: "Address", icon: MapPin },
    { number: 3, title: "Payment", icon: CreditCard },
    { number: 4, title: "Review", icon: ShieldCheck },
  ];

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
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-3xl mx-auto px-4">
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
                        Last Name *
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
                        className={`w-full px-5 py-3.5 bg-black/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] transition-all duration-300
                          ${
                            errors.lastName
                              ? "border-red-500 shake"
                              : "border-gray-700 focus:shadow-lg focus:shadow-[#8E6740]/20"
                          }`}
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
                        setUserDetails({ ...userDetails, email: e.target.value })
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
                        setUserDetails({ ...userDetails, phone: e.target.value })
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

                  {!showNewAddress ? (
                    <>
                      {/* Saved Addresses */}
                      <div className="grid grid-cols-1 gap-4">
                        {savedAddresses.map((addr) => (
                          <div
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`group p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02]
                              ${
                                selectedAddressId === addr.id
                                  ? "border-[#8E6740] bg-gradient-to-br from-[#8E6740]/10 to-transparent shadow-lg shadow-[#8E6740]/20"
                                  : "border-gray-700 bg-black/30 hover:border-gray-600"
                              }`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                                  ${
                                    selectedAddressId === addr.id
                                      ? "bg-[#8E6740] text-white"
                                      : "bg-gray-800 text-gray-400"
                                  }`}
                                >
                                  <Home size={18} />
                                </div>
                                <div>
                                  <span className="font-semibold capitalize text-white text-lg">
                                    {addr.type}
                                  </span>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    Default address
                                  </p>
                                </div>
                              </div>
                              {selectedAddressId === addr.id && (
                                <div className="w-8 h-8 rounded-full bg-[#8E6740] flex items-center justify-center animate-scaleIn">
                                  <Check size={16} className="text-white" />
                                </div>
                              )}
                            </div>
                            <div className="ml-13 space-y-1">
                              <p className="text-sm font-medium text-gray-200">
                                {addr.name}
                              </p>
                              <p className="text-sm text-gray-400">
                                {addr.address}, {addr.area}
                              </p>
                              <p className="text-sm text-gray-400">
                                {addr.city}, {addr.state} - {addr.pincode}
                              </p>
                              <p className="text-sm text-gray-400 mt-2 flex items-center gap-2">
                                <span className="text-[#8E6740]">📞</span>
                                {addr.phone}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

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
                        <label className="flex-1 relative">
                          <input
                            type="radio"
                            name="type"
                            value="home"
                            checked={newAddress.type === "home"}
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
                            <span className="text-gray-300 font-medium">
                              Home
                            </span>
                          </div>
                        </label>
                      </div>

                      <input
                        type="text"
                        placeholder="House/Flat/Building"
                        value={newAddress.address}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            address: e.target.value,
                          })
                        }
                        className={`w-full px-5 py-3.5 bg-black/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] transition-all duration-300
                          ${
                            errors.address
                              ? "border-red-500"
                              : "border-gray-700 focus:shadow-lg focus:shadow-[#8E6740]/20"
                          }`}
                      />

                      <input
                        type="text"
                        placeholder="Area/Street/Locality"
                        value={newAddress.area}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, area: e.target.value })
                        }
                        className={`w-full px-5 py-3.5 bg-black/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] transition-all duration-300
                          ${
                            errors.area
                              ? "border-red-500"
                              : "border-gray-700 focus:shadow-lg focus:shadow-[#8E6740]/20"
                          }`}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="City"
                          value={newAddress.city}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              city: e.target.value,
                            })
                          }
                          className={`w-full px-5 py-3.5 bg-black/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] transition-all duration-300
                            ${
                              errors.city
                                ? "border-red-500"
                                : "border-gray-700 focus:shadow-lg focus:shadow-[#8E6740]/20"
                            }`}
                        />

                        <select
                          value={newAddress.state}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              state: e.target.value,
                            })
                          }
                          className={`w-full px-5 py-3.5 bg-black/50 border-2 rounded-xl text-white focus:outline-none focus:border-[#8E6740] transition-all duration-300
                            ${
                              errors.state
                                ? "border-red-500"
                                : "border-gray-700 focus:shadow-lg focus:shadow-[#8E6740]/20"
                            }`}
                        >
                          <option value="">Select State</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Kerala">Kerala</option>
                        </select>

                        <input
                          type="text"
                          placeholder="Pincode"
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
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Payment */}
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
                        value="card"
                        checked={paymentData.method === "card"}
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
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-4">
                          <CreditCard className="text-white" size={20} />
                        </div>
                        <div className="flex-1">
                          <span className="text-white font-semibold text-lg block">
                            Credit/Debit Card
                          </span>
                          <span className="text-gray-400 text-xs">
                            Visa, Mastercard, Amex
                          </span>
                        </div>
                        {paymentData.method === "card" && (
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
                        value="upi"
                        checked={paymentData.method === "upi"}
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
                          <span className="text-white font-bold text-sm">
                            UPI
                          </span>
                        </div>
                        <div className="flex-1">
                          <span className="text-white font-semibold text-lg block">
                            UPI Payment
                          </span>
                          <span className="text-gray-400 text-xs">
                            Google Pay, PhonePe, Paytm
                          </span>
                        </div>
                        {paymentData.method === "upi" && (
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

                  {paymentData.method === "card" && (
                    <div className="space-y-4 mt-6 p-6 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-gray-800 animate-slideInRight">
                      <h4 className="text-white font-semibold mb-4">
                        Card Details
                      </h4>
                      <input
                        type="text"
                        placeholder="Card Number"
                        value={paymentData.cardNumber}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            cardNumber: e.target.value,
                          })
                        }
                        className={`w-full px-5 py-3.5 bg-black/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] transition-all duration-300
                          ${
                            errors.cardNumber
                              ? "border-red-500"
                              : "border-gray-700 focus:shadow-lg focus:shadow-[#8E6740]/20"
                          }`}
                      />

                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        value={paymentData.cardName}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            cardName: e.target.value,
                          })
                        }
                        className={`w-full px-5 py-3.5 bg-black/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] transition-all duration-300
                          ${
                            errors.cardName
                              ? "border-red-500"
                              : "border-gray-700 focus:shadow-lg focus:shadow-[#8E6740]/20"
                          }`}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={paymentData.expiry}
                          onChange={(e) =>
                            setPaymentData({
                              ...paymentData,
                              expiry: e.target.value,
                            })
                          }
                          className={`w-full px-5 py-3.5 bg-black/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] transition-all duration-300
                            ${
                              errors.expiry
                                ? "border-red-500"
                                : "border-gray-700 focus:shadow-lg focus:shadow-[#8E6740]/20"
                            }`}
                        />

                        <input
                          type="text"
                          placeholder="CVV"
                          maxLength="3"
                          value={paymentData.cvv}
                          onChange={(e) =>
                            setPaymentData({
                              ...paymentData,
                              cvv: e.target.value,
                            })
                          }
                          className={`w-full px-5 py-3.5 bg-black/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] transition-all duration-300
                            ${
                              errors.cvv
                                ? "border-red-500"
                                : "border-gray-700 focus:shadow-lg focus:shadow-[#8E6740]/20"
                            }`}
                        />
                      </div>
                    </div>
                  )}

                  {paymentData.method === "upi" && (
                    <div className="mt-6 p-6 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-gray-800 animate-slideInRight">
                      <h4 className="text-white font-semibold mb-4">
                        UPI Details
                      </h4>
                      <input
                        type="text"
                        placeholder="Enter UPI ID (e.g., name@upi)"
                        value={paymentData.upiId}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            upiId: e.target.value,
                          })
                        }
                        className="w-full px-5 py-3.5 bg-black/50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8E6740] focus:shadow-lg focus:shadow-[#8E6740]/20 transition-all duration-300"
                      />
                    </div>
                  )}
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

                  {/* Order Items */}
                  <div className="border-2 border-gray-800 rounded-2xl p-6 bg-gradient-to-br from-gray-900/50 to-black/50">
                    <div className="flex items-center gap-3 mb-4">
                      <Package className="text-[#8E6740]" size={20} />
                      <h3 className="font-semibold text-white text-lg">
                        Order Items
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center py-3 border-b border-gray-800 last:border-0"
                        >
                          <div>
                            <span className="text-gray-200 font-medium">
                              {item.name}
                            </span>
                            <span className="text-gray-500 text-sm ml-2">
                              × {item.qty}
                            </span>
                          </div>
                          <span className="font-semibold text-white">
                            ₹{(item.price * item.qty).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

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

                  {/* Delivery Info */}
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
                            , {
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

                  {/* Payment Info */}
                  <div className="border-2 border-gray-800 rounded-2xl p-6 bg-gradient-to-br from-gray-900/50 to-black/50">
                    <div className="flex items-center gap-3 mb-4">
                      <CreditCard className="text-[#8E6740]" size={20} />
                      <h3 className="font-semibold text-white text-lg">
                        Payment Method
                      </h3>
                    </div>
                    <p className="text-gray-300 font-medium">
                      {paymentData.method === "card" &&
                        "💳 Credit/Debit Card"}
                      {paymentData.method === "upi" && "📱 UPI Payment"}
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
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#8E6740] to-[#6b4e2f] text-white rounded-xl font-semibold hover:from-[#6b4e2f] hover:to-[#8E6740] transition-all duration-300 shadow-lg shadow-[#8E6740]/50 transform hover:scale-105"
                >
                  {currentStep === 4 ? "Place Order" : "Next"}
                  <ChevronRight size={20} />
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

                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start p-3 bg-black/30 rounded-xl"
                    >
                      <div>
                        <p className="text-gray-200 font-medium text-sm">
                          {item.name}
                        </p>
                        <p className="text-gray-500 text-xs">Qty: {item.qty}</p>
                      </div>
                      <p className="text-white font-semibold text-sm">
                        ₹{(item.price * item.qty).toLocaleString()}
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

                <div className="flex justify-between items-center pt-4">
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

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
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

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.5s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out;
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