import { useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { assets } from "../../../public/assets/asset";
import { Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

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

  // ⭐ NEW: Initialize the Google Login Hook
  const googleSignIn = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      // The token is in tokenResponse.access_token for implicit flow
      handleGoogleSuccess(tokenResponse);
    },
    onError: () => {
      setError("Google Sign-In was unsuccessful. Please try again.");
    },
    flow: "implicit",
  });

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

  //mock google sign in test
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // 1. Decode the Google Token directly on the frontend
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Decoded Google User Info:", decoded); // Console-la paakunga!

      // 2. Simulate storing user data (like your real backend would do)
      const mockUserData = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        role: "user", // Default role for testing
      };

      localStorage.setItem("token", "dummy-jwt-token-for-google-user"); // Dummy token
      localStorage.setItem("user", JSON.stringify(mockUserData));

      // 3. Show success message and redirect
      setSuccess("Google login successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      console.error("Google Login decode error:", err);
      setError("Failed to process Google login. Please try again.");
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

            {/* google sinup */}
            <div className="relative flex py-3 items-center">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>

            <button
              onClick={() => googleSignIn()}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white text-black text-[14px] font-body font-normal py-3 rounded-[150px] transition-all duration-200 transform mt-2 hover:scale-95 hover:bg-accet hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path
                  fill="#4285F4"
                  d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"
                />
                <path
                  fill="#34A853"
                  d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.53H1.83v2.1A7.98 7.98 0 0 0 8.98 17z"
                />
                <path
                  fill="#FBBC05"
                  d="M4.5 10.49a4.77 4.77 0 0 1 0-3.04V5.35H1.83a7.98 7.98 0 0 0 0 7.14l2.67-2z"
                />
                <path
                  fill="#EA4335"
                  d="M8.98 3.58c1.17 0 2.23.4 3.06 1.2l2.3-2.3A7.92 7.92 0 0 0 1.83 5.35L4.5 7.45a4.77 4.77 0 0 1 4.48-3.87z"
                />
              </svg>
              Sign up with Google
            </button>

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
