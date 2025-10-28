import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { assets } from "../../../public/assets/asset";
import { Link } from "react-router-dom";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  // ⭐ UPDATED: Role-based redirect
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 🔗 CONNECTION POINT: Send POST request to Flask backend
      const response = await fetch('http://localhost:5000/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Success: Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // ⭐ NEW: Check user role and redirect accordingly
        if (data.user.role === 'admin') {
          setSuccess('Admin login successful! Redirecting to dashboard...');
          setTimeout(() => {
            window.location.href = '/admin/dashboard';
          }, 1000);
        } else {
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        }
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to connect to server. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="w-full h-full mx-auto flex justify-center items-center absolute py-5">
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={assets.signup} type="video/mp4" />
        </video>

        {/* Background Overlay */}
        <div className="absolute top-0 w-full h-[30vh] bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 w-full h-[30vh] bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl px-6">
        {/* Heading */}
        <h1 className="text-[25px] font-['Poppins'] capitalize font-semibold text-center text-black py-2">
          Sign in your account
        </h1>

        <div className="bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 bg-black/15 justify-center overflow-hidden rounded-[25px] px-10 py-4">
          {/* Form */}
          <div className="w-[80%] mx-auto space-y-3">
            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-500 bg-opacity-90 text-white rounded-lg font-medium animate-pulse">
                {error}
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="mb-6 p-4 bg-green-500 bg-opacity-90 text-white rounded-lg font-medium">
                {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Email Input */}
              <div className="py-2">
                <label className="block text-[12px] font-['Poppins'] font-semibold text-gray-900 py-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane@framer.com"
                  required
                  className="w-full px-4 py-2 font-['Poppins'] rounded-lg text-[13px] bg-white/60 bg-opacity-80 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>

              {/* Password Input */}
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

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8E6740] text-[14px] font-['Poppins'] hover:bg-[#8e6740cc] text-white font-semibold py-2 rounded-lg transition duration-200 transform mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Links */}
            <div className="mt-10 space-y-2 py-4">
              {/* Forgot Password */}
              <p className="text-center">
                <Link
                  to={"/forgot-password"}
                  className="font-semibold text-gray-900 font-['Poppins'] hover:underline"
                >
                  Forgot Password?
                </Link>
              </p>

              {/* Sign Up Link */}
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
