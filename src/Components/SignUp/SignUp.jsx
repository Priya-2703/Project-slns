import { useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { assets } from "../../../public/assets/asset";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  // ⭐ NEW: Password validation function
  const validatePassword = (password) => {
    return {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const passwordValidation = validatePassword(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Account created successfully! Redirecting to sign in...");

        setFormData({
          name: "",
          email: "",
          password: "",
        });

        setTimeout(() => {
          window.location.href = "/signin";
        }, 2000);
      } else {
        setError(data.error || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Background Video */}
      <div className="w-full h-full mx-auto flex justify-center items-center absolute py-5">
        <video
          autoPlay
          muted
          loop
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={assets.signup} type="video/mp4" />
        </video>

        {/* Background Overlay */}
        <div className="absolute top-0 w-full h-[30vh] bg-linear-to-b from-black to-transparent" />
        <div className="absolute bottom-0 w-full h-[30vh] bg-linear-to-t from-black to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl px-6">
        {/* Heading */}
        <h1 className="text-[16px] md:text-[25px] font-['Poppins'] capitalize font-semibold text-center text-black py-2">
          Create a new account
        </h1>
        <div className="bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 bg-black/15 justify-center overflow-hidden rounded-[25px] px-4 md:px-10 py-4">
          {/* Form */}
          <div className="w-[90%] md:w-[80%] mx-auto space-y-2">
            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-3 bg-red-500 bg-opacity-80 text-white rounded-lg">
                {error}
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="mb-4 p-3 bg-green-500 bg-opacity-80 text-white rounded-lg">
                {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Name Input */}
              <div className="md:py-2">
                <label className="block text-[11px] md:text-[12px] font-['Poppins'] font-semibold text-gray-900 py-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  required
                  className="w-full px-4 py-2 font-['Poppins'] rounded-lg text-[11px] md:text-[13px] bg-white/60 bg-opacity-80 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>

              {/* Email Input */}
              <div className="md:pb-1">
                <label className="block font-['Poppins'] text-[11px] md:text-[12px] font-semibold text-gray-900 py-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane@framer.com"
                  required
                  className="w-full px-4 py-2 font-['Poppins'] rounded-lg text-[11px] md:text-[13px] bg-white/60 bg-opacity-80 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>

              {/* Password Input */}
              <div className="md:pb-1">
                <label className="block font-['Poppins'] text-[11px] md:text-[12px] font-semibold text-gray-900 py-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="jane@123456"
                    required
                    className="w-full px-4 py-2 font-['Poppins'] rounded-lg text-[11px] md:text-[13px] bg-white/60 bg-opacity-80 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* ⭐ NEW: Password Requirements Below Input */}
                {formData.password && (
                  <div className="mt-2 font-['Poppins'] bg-gray-900 bg-opacity-50 rounded-lg p-3">
                    <h3 className="font-semibold text-[10px] md:text-[11px] text-white mb-2">
                      Password Requirements:
                    </h3>
                    <div className="space-y-1">
                      {/* Minimum Length */}
                      <div className="flex items-center gap-2">
                        {passwordValidation.minLength ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <X size={14} className="text-red-400" />
                        )}
                        <span
                          className={`text-[8px] md:text-[10px] ${
                            passwordValidation.minLength
                              ? "text-green-300"
                              : "text-gray-300"
                          }`}
                        >
                          At least 8 characters
                        </span>
                      </div>

                      {/* Uppercase Letter */}
                      <div className="flex items-center gap-2">
                        {passwordValidation.hasUpperCase ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <X size={14} className="text-red-400" />
                        )}
                        <span
                          className={`text-[8px] md:text-[10px] ${
                            passwordValidation.hasUpperCase
                              ? "text-green-300"
                              : "text-gray-300"
                          }`}
                        >
                          One uppercase letter
                        </span>
                      </div>

                      {/* Lowercase Letter */}
                      <div className="flex items-center gap-2">
                        {passwordValidation.hasLowerCase ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <X size={14} className="text-red-400" />
                        )}
                        <span
                          className={`text-[8px] md:text-[10px] ${
                            passwordValidation.hasLowerCase
                              ? "text-green-300"
                              : "text-gray-300"
                          }`}
                        >
                          One lowercase letter
                        </span>
                      </div>

                      {/* Number */}
                      <div className="flex items-center gap-2">
                        {passwordValidation.hasNumber ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <X size={14} className="text-red-400" />
                        )}
                        <span
                          className={`text-[8px] md:text-[10px] ${
                            passwordValidation.hasNumber
                              ? "text-green-300"
                              : "text-gray-300"
                          }`}
                        >
                          At least one digit
                        </span>
                      </div>

                      {/* Special Character */}
                      <div className="flex items-center gap-2">
                        {passwordValidation.hasSpecialChar ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <X size={14} className="text-red-400" />
                        )}
                        <span
                          className={`text-[8px] md:text-[10px] ${
                            passwordValidation.hasSpecialChar
                              ? "text-green-300"
                              : "text-gray-300"
                          }`}
                        >
                          One special character (!@#$%^&*)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8E6740] text-[12px] md:text-[14px] font-['Poppins'] hover:bg-[#8e6740cc] text-white font-semibold py-2 rounded-lg transition duration-200 transform mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

            {/* Sign In Link */}
            <p className="text-center font-['Poppins'] text-[12px] md:text-[16px] text-gray-900 mt-3 md:mt-6">
              Already have an account?{" "}
              <Link
                to={"/signin"}
                className="font-semibold text-white hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
