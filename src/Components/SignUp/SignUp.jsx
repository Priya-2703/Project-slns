import { useState } from "react";
import { Eye, EyeOff, Check, X, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function SignUp() {
  const BACKEND_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Initialize the Google Login Hook
  const googleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // Get Google user info using the access token
      const userInfo = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        }
      ).then((res) => res.json());

      console.log("✅ Google user info:", userInfo);

      // Send to backend
      handleGoogleSuccess(userInfo);
    },
    onError: () => {
      setError("Google Sign-In failed. Please try again.");
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

  // Password validation function
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
    setShowVerificationMessage(false);

    try {
      const response = await fetch(`${BACKEND_URL}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Show verification message instead of redirect
        setSuccess(data.message);
        setUserEmail(formData.email);
        setShowVerificationMessage(true);

        setFormData({
          name: "",
          email: "",
          password: "",
        });
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

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/resend-verification`,
        { email: userEmail }
      );

      setSuccess(response.data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to resend email");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (userInfo) => {
    const { name, email, picture, sub } = userInfo;
    setLoading(true);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/google-auth`,
        { name, email, picture, sub },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => (window.location.href = "/"), 1000);
    } catch (err) {
      console.error("Google login error:", err);
      setError(err.response?.data?.error || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden sign_page">
      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl px-6">
        {/* Heading */}
        <h1 className="text-[16px] md:text-[25px] font-['Poppins'] capitalize font-semibold text-center text-white py-2">
          Create a new account
        </h1>
        <div className="bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 bg-white/5 justify-center overflow-hidden rounded-[25px] px-4 md:px-10 py-4">
          {/* Form */}
          <div className="w-[90%] md:w-[80%] mx-auto space-y-2">
            {/* Success Message - Email Verification Required */}
            {showVerificationMessage && (
              <div className="mb-4 p-4 bg-blue-500 bg-opacity-80 text-white rounded-lg">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">
                      Verify Your Email Address
                    </h3>
                    <p className="text-sm mb-2">{success}</p>
                    <p className="text-sm mb-3">
                      We've sent a verification link to{" "}
                      <strong>{userEmail}</strong>
                    </p>
                    <div className="flex flex-col gap-2">
                      <p className="text-xs">
                        Didn't receive the email? Check your spam folder or
                      </p>
                      <button
                        onClick={handleResendVerification}
                        disabled={loading}
                        className="text-sm underline hover:no-underline disabled:opacity-50"
                      >
                        {loading ? "Sending..." : "Resend verification email"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Alert */}
            {error && !showVerificationMessage && (
              <div className="mb-4 p-3 bg-red-500 bg-opacity-80 text-white rounded-lg">
                {error}
              </div>
            )}

            {/* Success Alert (Non-verification) */}
            {success && !showVerificationMessage && (
              <div className="mb-4 p-3 bg-green-500 bg-opacity-80 text-white rounded-lg">
                {success}
              </div>
            )}

            {/* Form - Hide when verification message is shown */}
            {!showVerificationMessage && (
              <>
                <form onSubmit={handleSubmit} className="space-y-2">
                  {/* Name Input */}
                  <div className="md:py-2">
                    <label className="block text-[11px] md:text-[12px] font-['Poppins'] font-semibold text-white py-1">
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
                    <label className="block font-['Poppins'] text-[11px] md:text-[12px] font-semibold text-white py-1">
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
                    <label className="block font-['Poppins'] text-[11px] md:text-[12px] font-semibold text-white py-1">
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
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>

                    {/* Password Requirements */}
                    {formData.password && (
                      <div className="mt-2 font-['Poppins'] bg-gray-900 bg-opacity-50 rounded-lg p-3">
                        <h3 className="font-semibold text-[10px] md:text-[11px] text-white mb-2">
                          Password Requirements:
                        </h3>
                        <div className="space-y-1">
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

                {/* Google signup */}
                <div className="relative flex py-3 items-center">
                  <div className="flex-grow border-t border-gray-400"></div>
                  <span className="flex-shrink mx-4 text-gray-400 text-sm">
                    OR
                  </span>
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
                <p className="text-center font-['Poppins'] text-[12px] md:text-[16px] text-white mt-3 md:mt-6">
                  Already have an account?{" "}
                  <Link
                    to={"/signin"}
                    className="font-semibold text-accet hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </>
            )}

            {/* Show Sign In link when verification message is displayed */}
            {showVerificationMessage && (
              <div className="mt-4 text-center">
                <Link
                  to="/signin"
                  className="text-white hover:text-amber-400 underline text-sm"
                >
                  Go to Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}