import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // Replace with your actual backend API endpoint
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Password reset link sent to your email.');
      } else {
        setError(data.error || 'Failed to send password reset link.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      <div className="relative z-10 w-full max-w-2xl px-6">
        {/* Heading */}
          <h2 className="text-4xl font-bold text-center text-white mb-10">
            Reset Password
          </h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className='text-gray-400'>Email:</label>
        </div>
        <div>
            <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="jane@framer.com"
            className="w-full px-4 py-3 rounded-lg bg-[#1c1c1c] bg-opacity-80 text-gray-800 placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#8e6740cc]"
          />
        </div>
        <div className='flex justify-center'>
          <button type="submit" className="w-md bg-[#8E6740] hover:bg-[#8e6740cc] text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-105 mt-8 ">Send Reset Email  </button>
        </div>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;