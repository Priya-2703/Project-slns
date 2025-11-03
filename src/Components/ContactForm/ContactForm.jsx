import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ContactForm.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    subject: "",
    message: "",
  });

  //dynamic title
  useEffect(() => {
  document.title = `Contact - SLNS Sarees`;
}, []);

  // ⭐ NEW: State for loading and feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear messages when user types
    if (error) setError("");
    if (success) setSuccess("");
  };

  // ⭐ NEW: Backend connection function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Optional: Get token if user is logged in
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
      };

      // Add authorization header if token exists
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // 🔗 CONNECTION POINT: Send POST request to Flask backend
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Success
        setSuccess(data.message || "Your message has been sent successfully!");

        // Clear form after successful submission
        setFormData({
          name: "",
          email: "",
          location: "",
          subject: "",
          message: "",
        });

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccess("");
        }, 5000);
      } else {
        // ❌ Error from backend
        setError(data.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      // ❌ Network or other error
      console.error("Contact form error:", err);
      setError(
        "Unable to connect to server. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const formGroupVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 30px rgba(255, 255, 255, 0.2)",
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.98 },
    loading: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="contact-form-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="contact-form-wrapper" variants={containerVariants}>
        <motion.h1
          className="contact-title font-heading font-[950] capitalize text-[65px]"
          variants={titleVariants}
        >
          Contact us
        </motion.h1>

        {/* ⭐ NEW: Success Message with Animation */}
        <AnimatePresence mode="wait">
          {success && (
            <motion.div
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                padding: "15px",
                marginBottom: "20px",
                backgroundColor: "#4CAF50",
                color: "white",
                borderRadius: "8px",
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ⭐ NEW: Error Message with Animation */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                padding: "15px",
                marginBottom: "20px",
                backgroundColor: "#f44336",
                color: "white",
                borderRadius: "8px",
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form
          onSubmit={handleSubmit}
          className="contact-form font-body"
          variants={containerVariants}
        >
          <motion.div
            className="form-group font-body"
            variants={formGroupVariants}
          >
            <label htmlFor="name" className="form-label">
              NAME*
            </label>
            <motion.input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Jane Smith"
              className="form-input"
              required
              disabled={loading}
              whileFocus={{ scale: 1.01, borderColor: "#fff" }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>

          <motion.div className="form-group" variants={formGroupVariants}>
            <label htmlFor="email" className="form-label">
              EMAIL*
            </label>
            <motion.input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="jane@gmail.com"
              className="form-input"
              required
              disabled={loading}
              whileFocus={{ scale: 1.01, borderColor: "#fff" }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>

          <motion.div className="form-group" variants={formGroupVariants}>
            <label htmlFor="location" className="form-label">
              LOCATION*
            </label>
            <div className="select-wrapper">
              <motion.select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-select font-body"
                required
                disabled={loading}
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
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
              </motion.select>
              <div className="select-arrow">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div className="form-group" variants={formGroupVariants}>
            <label htmlFor="subject" className="form-label">
              Subject *
            </label>
            <div className="select-wrapper">
              <motion.select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="form-select"
                required
                disabled={loading}
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <option value="">Select a subject</option>
                <option value="product-inquiry">Product Inquiry</option>
                <option value="order-support">Order Support</option>
                <option value="bulk-order">Bulk Order</option>
                <option value="partnership">Partnership</option>
                <option value="b2b-inquiry">B2B Inquiry</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </motion.select>
              <div className="select-arrow">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div className="form-group" variants={formGroupVariants}>
            <label htmlFor="message" className="form-label">
              MESSAGE
            </label>
            <motion.textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Hello!"
              rows="5"
              className="form-textarea"
              disabled={loading}
              whileFocus={{ scale: 1.01, borderColor: "#fff" }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>

          {/* ⭐ UPDATED: Submit button with loading state and animation */}
          <motion.button
            type="submit"
            className="submit-button uppercase"
            disabled={loading}
            style={{
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            variants={buttonVariants}
            initial="initial"
            whileHover={!loading ? "hover" : "loading"}
            whileTap={!loading ? "tap" : {}}
            animate={loading ? "loading" : "initial"}
          >
            {loading ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{ display: "inline-block" }}
                >
                  ⏳
                </motion.span>
                Sending...
              </motion.span>
            ) : (
              "Submit"
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default ContactForm;
