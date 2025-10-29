import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function B2bSignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">

      {/* Background Overlay */}
    

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl px-6">
        {/* Heading */}
          <h1 className="text-4xl font-bold text-center text-[#DEDEDE] mb-10">
            Welcome Back
          </h1>

       

          {/* Form */}
          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-[#888888] mb-3">
                Business Name
              </label>
              <input
                type="text"
                name="bname"
                value={formData.bname}
                onChange={handleChange}
                placeholder="Das & Co"
                className="w-full px-4 py-3 rounded-lg bg-[#1c1c1c] bg-opacity-80 text-gray-800 placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#8E6740]"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-[#888888] mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Das@123456"
                  className="w-full px-4 py-3 rounded-lg bg-[#1c1c1c] bg-opacity-80 text-gray-800 placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#8E6740]"
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
            </div>

            {/* Sign In Button */}
        <div className='flex justify-center'>
          <button onClick={handleSubmit} type="submit" className="w-md bg-[#8E6740] hover:bg-[#8e6740cc] text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-105 mt-8 ">Sign In</button>
        </div>
          </div>

          {/* Links */}
          <div className="mt-8 space-y-4">
            {/* Forgot Password */}
            <p className="text-center">
              <a href="/forgot-password" className="font-semibold text-[#858585] hover:underline">
                Forgot Password?
              </a>
            </p>

            {/* Sign Up Link */}
            <p className="text-center text-[#858585]">
              Don't have an Account?{' '}
              <a href="/b2b-signup" className="font-semibold text-[#8E6740] hover:underline">
                Sign up
              </a>
            </p>
          </div>
      </div>
    </div>
  );
}