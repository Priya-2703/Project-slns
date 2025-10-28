import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { assets } from "../../../public/assets/asset";
import { Link } from "react-router-dom";

export default function B2bSignUp() {
  const [formData, setFormData] = useState({
    name: "",
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
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Background Video */}
      <div className="w-full h-full mx-auto flex justify-center items-center absolute py-5">
        <video
          autoPlay
          muted
          preload="auto"
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={assets.bgvideo} type="video/mp4" />
        </video>

        {/* Background Overlay */}
        <div className="absolute top-0 w-full h-[30vh] bg-linear-to-b from-black to-transparent" />
        <div className="absolute bottom-0 w-full h-[30vh] bg-linear-to-t from-black to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl px-6">
        {/* Heading */}
        <h1 className="text-[16px] md:text-[25px] font-['Poppins'] capitalize font-semibold text-center text-black py-2">
          WELCOME TO SLNS <br className="hidden md:block"/> B2B LOGIN
        </h1>
        <div className="bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 bg-black/15 justify-center overflow-hidden rounded-[25px] px-5 md:px-10 py-4">
          {/* Form */}
          <div className="w-full mx-auto space-y-1 md:space-y-3">
            {/* Name Input */}
            <div className="flex md:flex-row flex-col justify-center md:items-center gap-1 md:gap-2">
              <div>
                <label className="block text-[11px] md:text-[12px] font-['Poppins'] font-semibold text-gray-900 py-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Das"
                  className="w-full px-4 py-2 font-['Poppins'] rounded-lg text-[11px] md:text-[13px] bg-white/60 bg-opacity-80 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>

              <div>
                <label className="block text-[11px] md:text-[12px] font-['Poppins'] font-semibold text-gray-900 py-1">
                  Business Name
                </label>
                <input
                  type="text"
                  name="bname"
                  value={formData.bname}
                  onChange={handleChange}
                  placeholder="Das & Co"
                  className="w-full px-4 py-2 font-['Poppins'] rounded-lg text-[11px] md:text-[13px] bg-white/60 bg-opacity-80 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>
            </div>
            <div className="flex md:flex-row flex-col justify-center md:items-center gap-1 md:gap-2">
              {/* Email Input */}
              <div>
                <label className="block text-[11px] md:text-[12px] font-['Poppins'] font-semibold text-gray-900 py-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="das@gamil.com"
                  className="w-full px-4 py-2 font-['Poppins'] rounded-lg text-[11px] md:text-[13px] bg-white/60 bg-opacity-80 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-[11px] md:text-[12px] font-['Poppins'] font-semibold text-gray-900 py-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Das@123456"
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
              </div>
            </div>

            <div className="flex md:flex-row flex-col justify-center md:items-center gap-1 md:gap-2">
              {/* Mobile no Input */}
              <div>
                <label className="block text-[11px] md:text-[12px] font-['Poppins'] font-semibold text-gray-900 py-1">
                  Phone No
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2 font-['Poppins'] rounded-lg text-[11px] md:text-[13px] bg-white/60 bg-opacity-80 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>
  
              {/* Name Input */}
              <div>
                <label className="block text-[11px] md:text-[12px] font-['Poppins'] font-semibold text-gray-900 py-1">
                  GST Number
                </label>
                <input
                  type="text"
                  name="gst"
                  value={formData.gst}
                  onChange={handleChange}
                  placeholder="25DAS482LEO2117"
                  className="w-full px-4 py-2 font-['Poppins'] rounded-lg text-[11px] md:text-[13px] bg-white/60 bg-opacity-80 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-[#8E6740] text-[12px] md:text-[14px] font-['Poppins'] hover:bg-[#8e6740cc] text-white font-semibold py-2 rounded-lg transition duration-200 transform mt-2"
            >
              Sign Up
            </button>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-[13px] md:text-[16px] font-['Poppins'] text-gray-900 mt-3 md:mt-6">
            Already have an account?{" "}
            <Link to={"/b2b-signin"}
              className="font-semibold text-black hover:underline"
            >
              Sign in
            </Link>
          </p>

          {/* Password Requirements */}
          <div className="mt-6 font-['Poppins'] bg-gray-900 bg-opacity-50 rounded-lg p-3 md:p-4">
            <h3 className="font-semibold text-[10px] md:text-[12px] text-white mb-2">
              Password Requirements
            </h3>
            <p className="text-[8px] md:text-[10px] text-gray-200">
              8 characters, 1 uppercase letter, 1 lowercase letter, at least one
              digit, at least one special character.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
