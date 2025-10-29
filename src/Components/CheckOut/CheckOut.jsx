import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function CheckOut() {
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
    <div className="w-full flex justify-center relative overflow-hidden mt-18 lg:mt-28 py-10">
      {/* Background Overlay */}

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl px-6">
        {/* Heading */}
        <h1 className="text-4xl font-heading text-center text-white font-[950] mb-3">
          CheckOut
        </h1>

        <div className="bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 bg-white/15 justify-center overflow-hidden rounded-[25px] px-5 md:px-10 py-5">
          {/* Form */}
          <div className="space-y-2">
            {/* Name Input */}
            <div>
              <label className="block text-[11px] md:text-[12px] font-['Poppins'] font-semibold text-[#888888] py-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Das & Co"
                className="w-full px-4 py-2 font-['Poppins'] rounded-lg text-[11px] md:text-[13px] bg-white/60 bg-opacity-80 text-gray-800 placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8E6740]"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-[11px] md:text-[12px] font-['Poppins'] font-semibold text-[#888888] py-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@gmail.com"
                className="w-full px-4 py-2 font-['Poppins'] rounded-lg text-[11px] md:text-[13px] bg-white/60 bg-opacity-80 text-gray-800 placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8E6740]"
              />
            </div>

            {/* House no. */}
            <div>
              <label className="block text-[11px] md:text-[12px] font-['Poppins'] font-semibold text-[#888888] py-1">
                House no./Flat No./Building name/Apartment name
              </label>
              <input
                type="text"
                name="house_no"
                value={formData.house_no}
                onChange={handleChange}
                placeholder="House No.: 101, Bharat Apartment"
                className="w-full px-4 py-2 font-['Poppins'] rounded-lg text-[11px] md:text-[13px] bg-white/60 bg-opacity-80 text-gray-800 placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8E6740]"
              />
            </div>

            {/* Area Input */}
            <div>
              <label className="block text-[11px] md:text-[12px] font-['Poppins'] font-semibold text-[#888888] py-1">
                Area/Street/Road name/Colony
              </label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="5th Main Road"
                className="w-full px-4 py-2 font-['Poppins'] rounded-lg text-[11px] md:text-[13px] bg-white/60 bg-opacity-80 text-gray-800 placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8E6740]"
              />
            </div>

            {/* City Input */}
            <div>
              <label className="block text-[11px] md:text-[12px] font-['Poppins'] font-semibold text-[#888888] py-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.area}
                onChange={handleChange}
                placeholder="Salem"
                className="w-full px-4 py-2 font-['Poppins'] rounded-lg text-[11px] md:text-[13px] bg-white/60 bg-opacity-80 text-gray-800 placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8E6740]"
              />
            </div>

            {/* Name Input */}
            <div className="form-group block text-sm font-medium text-[#888888] mb-3">
              <label
                htmlFor="location"
                className="block text-[11px] md:text-[12px] font-['Poppins'] font-semibold text-[#888888] py-1"
              >
                Location
              </label>
              <div className="select-wrapper">
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 font-['Poppins'] rounded-lg text-[11px] md:text-[13px] bg-white/60 bg-opacity-80 text-gray-800 placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#8E6740]"
                  required
                >
                  <option value="">Select...</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                </select>
                {/* <div className="select-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div> */}
              </div>
            </div>

            {/* Sign In Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                type="submit"
                className="w-full bg-[#8E6740] text-[12px] md:text-[14px] font-['Poppins'] hover:bg-[#8e6740cc] text-white font-semibold py-2 rounded-lg transition duration-200 transform mt-2"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Links */}
          <div className="mt-8 space-y-2 mb-3">
            {/* Forgot Password */}
            <p className="text-center text-[13px] md:text-[16px] font-['Poppins'] text-[#888888]">
              <a
                href="/forgot-password"
                className="font-semibold text-[#858585] hover:underline"
              >
                Forgot Password?
              </a>
            </p>

            {/* Sign Up Link */}
            <p className="text-center text-[13px] md:text-[16px] font-['Poppins'] text-[#888888]">
              Don't have an Account?{" "}
              <a
                href="/b2b-signup"
                className="font-semibold text-[#8E6740] hover:underline"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
