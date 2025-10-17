import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  
  // ⭐ NEW: State for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    setError('');
  };

  // ⭐ NEW: Backend connection function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 🔗 CONNECTION POINT: Send POST request to Flask backend
      const response = await fetch('http://localhost:5000/api/signup', {
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
        
        setSuccess('Account created successfully!');
        
        // Redirect to dashboard or home page after 1.5 seconds
        setTimeout(() => {
          window.location.href = '/'; // Change to your route
        }, 1500);
      } else {
        // ❌ Error from backend
        setError(data.error || 'Signup failed. Please try again.');
      }
    } catch (err) {
      // ❌ Network or other error
      console.error('Signup error:', err);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop')",
          filter: 'brightness(0.6)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl px-6">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-center text-black mb-8">
          Create a new account
        </h1>

        <div className="bg-gray-398 bg-opacity-30 backdrop-blur-sm rounded-2xl p-8">
          {/* ⭐ NEW: Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-80 text-white rounded-lg">
              {error}
            </div>
          )}

          {/* ⭐ NEW: Success Alert */}
          {success && (
            <div className="mb-4 p-3 bg-green-500 bg-opacity-80 text-white rounded-lg">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Smith"
                required
                className="w-full px-4 py-3 rounded-lg bg-yellow-50 bg-opacity-90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-598"
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
                placeholder="jane@framer.com"
                required
                className="w-full px-4 py-3 rounded-lg bg-yellow-50 bg-opacity-90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-598"
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
                  placeholder="jane@123456"
                  required
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

            {/* Sign Up Button - ⭐ UPDATED with loading state */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8E6740] hover:bg-[#8e6740cc] text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-gray-800 mt-6">
            Already have an account?{' '}
            <a href="/signin" className="font-semibold text-black hover:underline">
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