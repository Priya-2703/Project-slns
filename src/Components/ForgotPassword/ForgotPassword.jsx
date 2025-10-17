import React, { useState } from "react";
import { assets } from "../../../public/assets/asset";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      // Replace with your actual backend API endpoint
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Password reset link sent to your email.");
      } else {
        setError(data.error || "Failed to send password reset link.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Background Video */}
      <div className="w-[90%] h-[90%] mx-auto flex justify-center items-center absolute py-5">
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={assets.forpassbg} type="video/mp4" />
        </video>

        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl px-6">
        {/* Heading */}
        <h2 className="text-[25px] font-['Poppins'] capitalize font-semibold text-center text-white py-2">
          Reset Password
        </h2>
        <div className="bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 bg-white/5 justify-center overflow-hidden rounded-[10px] px-10 py-10">
          <form onSubmit={handleSubmit} className="w-[90%] mx-auto space-y-3">
            <div>
              <label htmlFor="email" className="block text-[12px] font-['Poppins'] font-semibold text-gray-300 py-1">
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="jane@framer.com"
                className="w-full px-4 py-2 font-['Poppins'] rounded-lg text-[13px] bg-white/60 bg-opacity-80 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full bg-[#8E6740] text-[14px] font-['Poppins'] hover:bg-[#8e6740cc] text-white font-semibold py-2 rounded-lg transition duration-200 transform mt-2"
              >
                Send Reset Email{" "}
              </button>
            </div>
          </form>
          {message && <p style={{ color: "green" }}>{message}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
