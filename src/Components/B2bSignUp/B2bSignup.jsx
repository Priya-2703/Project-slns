import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function B2bSignUp() {
  const [formData, setFormData] = useState({
    name: '',
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
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop')`,
          filter: 'brightness(0.6)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl px-6">
         {/* Heading */}
          <h1 className="text-4xl font-bold text-center text-black mb-8">
            WELCOME TO SLNS <br/> B2B LOGIN
          </h1>
        <div className="bg-gray-398 bg-opacity-30 backdrop-blur-sm rounded-2xl p-8">

          {/* Form */}
          <div className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Das"
                className="w-full px-4 py-3 rounded-lg bg-yellow-50  bg-opacity-90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-598"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Business Name
              </label>
              <input
                type="text"
                name="bname"
                value={formData.bname}
                onChange={handleChange}
                placeholder="Das & Co"
                className="w-full px-4 py-3 rounded-lg bg-yellow-50  bg-opacity-90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-598"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="das@gamil.com"
                className="w-full px-4 py-3 rounded-lg bg-yellow-50  bg-opacity-90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-598"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Das@123456"
                  className="w-full px-4 py-3 rounded-lg bg-yellow-50 bg-opacity-90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-598"
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

            {/* Mobile no Input */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Phone No
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-lg bg-yellow-50  bg-opacity-90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-598"
              />
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                GST Number
              </label>
              <input
                type="text"
                name="gst"
                value={formData.gst}
                onChange={handleChange}
                placeholder="25DAS482LEO2117"
                className="w-full px-4 py-3 rounded-lg bg-yellow-50  bg-opacity-90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-598"
              />
            </div>

            {/* Sign Up Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-[#8E6740] hover:bg-[#8e6740cc] text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-105"
            >
              Sign Up
            </button>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-gray-800 mt-6">
            Already have an account?{' '}
            <a href="/b2b-signin" className="font-semibold text-black hover:underline">
              Sign in
            </a>
          </p>

          {/* Password Requirements */}
          <div className="mt-6 bg-gray-600 bg-opacity-50 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Password Requirements</h3>
            <p className="text-sm text-gray-200">
              8 characters, 1 uppercase letter, 1 lowercase letter, at least one digit, at least one special character.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}