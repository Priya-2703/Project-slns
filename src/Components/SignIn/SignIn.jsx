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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="w-[90%] h-[90%] mx-auto flex justify-center items-center absolute py-5">
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={assets.signup} type="video/mp4" />
        </video>

        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black/15" />
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
                  className="w-full px-4 py-2 rounded-lg font-['Poppins'] bg-white/60 text-[13px] bg-opacity-80 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-[#8E6740] text-[14px] font-['Poppins'] hover:bg-[#8e6740cc] text-white font-semibold py-2 rounded-lg transition duration-200 transform mt-2"
            >
              Sign In
            </button>
          </div>

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
  );
}
