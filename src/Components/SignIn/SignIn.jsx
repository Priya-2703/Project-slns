import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function SignIn() {
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
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: 'brightness(0.5)'
        }}
      >
        <source src="/assets/signup.mp4" type="video/mp4" />
      </video>

      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl px-6">
        {/* Heading */}
          <h1 className="text-4xl font-bold text-center text-white mb-10">
            Sign in your account
          </h1>

        <div className="bg-gray-400 bg-opacity-30 backdrop-blur-md rounded-3xl p-10">

          {/* Form */}
          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@framer.com"
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-80 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="jane@123456"
                  className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-80 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
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
            <button
              onClick={handleSubmit}
              className="w-full bg-[#8E6740] hover:bg-[#8e6740cc] text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-105 mt-8"
            >
              Sign In
            </button>
          </div>

          {/* Links */}
          <div className="mt-8 space-y-4">
            {/* Forgot Password */}
            <p className="text-center">
              <a href="/forgot-password" className="font-semibold text-gray-900 hover:underline">
                Forgot Password?
              </a>
            </p>

            {/* Sign Up Link */}
            <p className="text-center text-gray-900">
              Don't have an Account?{' '}
              <a href="/signup" className="font-semibold text-black hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}