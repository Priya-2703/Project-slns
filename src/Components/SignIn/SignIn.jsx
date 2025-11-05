import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { assets } from "../../../public/assets/asset";
import { Link, Navigate, useNavigate } from "react-router-dom";

// ⭐ NEW: Google Login Import
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // ⭐ NEW: Initialize the Google Login Hook
  const googleSignIn = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("🔍 Token Response:", tokenResponse);
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
    if (error) setError("");
  };

  // ⭐ UPDATED: Role-based redirect
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // 🔗 CONNECTION POINT: Send POST request to Flask backend
      const response = await fetch("http://localhost:5000/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Success: Store token and user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userData", JSON.stringify(data.user));

        console.log("login data saved", data.user);

        // ⭐ NEW: Check user role and redirect accordingly
        if (data.user.role === "admin") {
          setSuccess("Admin login successful! Redirecting to dashboard...");
          setTimeout(() => {
            navigate("/admin/dashboard");
          }, 1000);
        } else {
          setSuccess("Login successful! Redirecting...");
          setTimeout(() => {
            navigate("/");
          }, 1000);
        }
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        "Unable to connect to server. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  //mock google sign in test
  const handleGoogleSuccess = async (tokenResponse) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("🔍 Full Token Response:", tokenResponse);

      // ✅ With implicit flow, we get access_token, NOT credential
      const accessToken = tokenResponse.access_token;

      if (!accessToken) {
        throw new Error("No access token received from Google");
      }

      console.log("✅ Access Token:", accessToken);

      // ✅ Fetch user info from Google API using access token
      const userInfoResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const googleUser = userInfoResponse.data;
      console.log("✅ Google User Info:", googleUser);

      // Create user data object
      const mockUserData = {
        name: googleUser.name,
        email: googleUser.email,
        picture: googleUser.picture,
        role: "user",
        phone: "",
        dob: "",
        gender: "",
      };

      // Store data
      const mockToken = "google-oauth-token-" + Date.now();
      localStorage.setItem("token", mockToken);
      localStorage.setItem("userData", JSON.stringify(mockUserData));
      localStorage.setItem("user", JSON.stringify(mockUserData));

      console.log("✅ Google login data saved:", mockUserData);

      setSuccess("Google login successful! Redirecting to profile...");
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err) {
      console.error("❌ Google Login error:", err);
      console.error("Error details:", err.response?.data || err.message);
      setError("Failed to process Google login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ⭐ NEW: Google Login Success Handler
  // const handleGoogleSuccess = async (credentialResponse) => {
  //   const googleToken = credentialResponse.credential;
  //   setLoading(true);
  //   setError("");
  //   setSuccess("");

  //   try {
  //     const response = await axios.post(
  //       "http://localhost:5000/api/auth/google-login",
  //       { token: googleToken }
  //     );
  //     const data = response.data;

  //     localStorage.setItem("token", data.appToken); // Assuming backend sends 'appToken'
  //     localStorage.setItem("user", JSON.stringify(data.user));

  //     if (data.user.role === "admin") {
  //       setSuccess("Admin login successful! Redirecting to dashboard...");
  //       setTimeout(() => (window.location.href = "/admin/dashboard"), 1000);
  //     } else {
  //       setSuccess("Login successful! Redirecting...");
  //       setTimeout(() => (window.location.href = "/"), 1000);
  //     }
  //   } catch (err) {
  //     console.error("Google Login error:", err);
  //     setError(
  //       err.response?.data?.message || "Google login failed. Please try again."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Video and Overlay - same as your code */}
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
        <div className="absolute top-0 w-full h-[30vh] bg-linear-to-b from-black to-transparent" />
        <div className="absolute bottom-0 w-full h-[30vh] bg-linear-to-t from-black to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6">
        <h1 className="text-[16px] md:text-[25px] font-['Poppins'] capitalize font-semibold text-center text-black py-2">
          Sign in your account
        </h1>

        <div className="bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 bg-black/15 justify-center overflow-hidden rounded-[25px] px-4 md:px-10 py-4">
          <div className="w-[80%] mx-auto space-y-3">
            {/* Error/Success Alerts - same as your code */}
            {error && (
              <div className="mb-6 p-4 bg-red-500 bg-opacity-90 text-white rounded-lg font-medium animate-pulse">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-500 bg-opacity-90 text-white rounded-lg font-medium">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Email and Password Inputs - same as your code */}
              <div className="py-2">
                <label className="block text-[12px] font-['Poppins'] font-semibold text-gray-900 py-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane@123456"
                  className="w-full px-4 py-2 rounded-lg font-['Poppins'] bg-white/60 text-[11px] md:text-[13px] bg-opacity-80 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>
              <div className="pb-1">
                <label className="block font-['Poppins'] text-[12px] font-semibold text-gray-900 py-1">
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
                    className="w-full px-4 py-2 rounded-lg font-['Poppins'] bg-white/60 text-[13px] bg-opacity-80 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8E6740] text-[14px] font-['Poppins'] hover:bg-[#8e6740cc] text-white font-semibold py-2 rounded-lg transition duration-200 transform mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* ⭐ NEW: Google Sign-In Button */}
            <div className="relative flex py-3 items-center">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="flex-shrink mx-4 font-body font-extrabold text-white text-sm">
                OR
              </span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>

            <div className="flex justify-center">
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
                Sign in with Google
              </button>
            </div>

            {/* Links - same as your code */}
            <div className="mt-6 space-y-2 py-4">
              <p className="text-center">
                <Link
                  to={"/forgot-password"}
                  className="font-semibold text-gray-900 font-['Poppins'] hover:underline"
                >
                  Forgot Password?
                </Link>
              </p>
              <p className="text-center font-['Poppins'] text-gray-900">
                Don't have an Account?{" "}
                <Link
                  to={"/signup"}
                  className="font-semibold text-white hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
