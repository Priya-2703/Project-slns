import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ContactForm.css";
import { useTranslation } from "react-i18next";

const ContactForm = () => {
  const {t} = useTranslation()
  const BACKEND_URL = import.meta.env.VITE_API_URL;
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${BACKEND_URL}/api/contact`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || "Your message has been sent successfully!");

        setFormData({
          name: "",
          email: "",
          location: "",
          subject: "",
          message: "",
        });

        setTimeout(() => {
          setSuccess("");
        }, 5000);
      } else {
        setError(data.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setError(
        "Unable to connect to server. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Enhanced Animation Variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.15,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const formGroupVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, scale: 0.9, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: -10,
      transition: { duration: 0.2 },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.03,
      boxShadow: "0 20px 40px rgba(255, 215, 0, 0.3)",
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.97 },
    loading: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="contact-page-wrapper">
      <motion.div
        className="container mx-auto mt-20 py-12 px-4 md:px-9"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Page Title */}
        <motion.div className="contact-header" variants={titleVariants}>
          <motion.h1 className="contact-main-title">
            {t("contact.header.main")} <span className="title-accent">{t("contact.header.accent")}</span>
          </motion.h1>
          <motion.p className="contact-subtitle font-body ">
            {t("contact.header.subtitle")}
          </motion.p>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div className="w-[95%] md:w-[90%] lg:w-[75%] mx-auto contact-grid font-body" variants={pageVariants}>
          <motion.div
            className="contact-info-section order-2"
            variants={cardVariants}
          >
            <div className="contact-details-grid">
              <motion.div
                className="detail-card"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="detail-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                </div>
                <div className="detail-content">
                  <h3 className="detail-label">{t("contact.details.phone")}</h3>
                  <p className="detail-value">+91 97862 87848</p>
                </div>
              </motion.div>

              <motion.div
                className="detail-card"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="detail-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
                <div className="detail-content">
                  <h3 className="detail-label">{t("contact.details.email")}</h3>
                  <p className="detail-value">slns@email.com</p>
                </div>
              </motion.div>

              <motion.div
                className="detail-card detail-card-full"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="detail-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                </div>
                <div className="detail-content">
                  <h3 className="detail-label">{t("contact.details.address")}</h3>
                  <p className="detail-value">
                    {t("about.address")}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="contact-form-section order-1"
            variants={cardVariants}
          >
            <div className="form-card bg-linear-to-br from-white/10 via-black/30 to-white/10 border border-white/20 backdrop-blur-md rounded-[28px] p-10 relative overflow-hidden shadow-md">
              <div className="form-card-gl ow"></div>

              {/* Success/Error Messages */}
              <AnimatePresence mode="wait">
                {success && (
                  <motion.div
                    className="alert-message alert-success"
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{success}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    className="alert-message alert-error"
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <motion.form
                onSubmit={handleSubmit}
                className="modern-contact-form"
                variants={pageVariants}
              >
                {/* Name & Email Row */}
                <div className="form-row">
                  <motion.div
                    className="form-field"
                    variants={formGroupVariants}
                  >
                    <label htmlFor="name" className="field-label">
                      <span className="label-text">{t("contact.form.name_label")}</span>
                      <span className="label-required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <motion.input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Jane Smith"
                        className="field-input"
                        required
                        disabled={loading}
                        whileFocus={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      />
                      <div className="input-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                          />
                        </svg>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="form-field"
                    variants={formGroupVariants}
                  >
                    <label htmlFor="email" className="field-label">
                      <span className="label-text">{t("contact.form.email_label")}</span>
                      <span className="label-required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <motion.input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="jane@example.com"
                        className="field-input"
                        required
                        disabled={loading}
                        whileFocus={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      />
                      <div className="input-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                          />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Location & Subject Row */}
                <div className="form-row">
                  <motion.div
                    className="form-field"
                    variants={formGroupVariants}
                  >
                    <label htmlFor="location" className="field-label">
                      <span className="label-text">{t("contact.form.location_label")}</span>
                      <span className="label-required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <motion.select
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="field-select"
                        required
                        disabled={loading}
                        whileFocus={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      >
                        <option value="">{t("contact.form.location_placeholder")}</option>
                        <option value="Andhra Pradesh">{t("contact.states.andhra_pradesh")}</option>
                        <option value="Arunachal Pradesh">
                          {t("contact.states.arunachal_pradesh")}
                        </option>
                        <option value="Assam">{t("contact.states.assam")}</option>
                        <option value="Bihar">{t("contact.states.bihar")}</option>
                        <option value="Chhattisgarh">{t("contact.states.chhattisgarh")}</option>
                        <option value="Goa">{t("contact.states.goa")}</option>
                        <option value="Gujarat">{t("contact.states.gujarat")}</option>
                        <option value="Haryana">{t("contact.states.haryana")}</option>
                        <option value="Himachal Pradesh">
                          {t("contact.states.himachal_pradesh")}
                        </option>
                        <option value="Karnataka">{t("contact.states.karnataka")}</option>
                        <option value="Kerala">{t("contact.states.kerala")}</option>
                        <option value="Tamil Nadu">{t("contact.states.tamil_nadu")}</option>
                        <option value="Telangana">{t("contact.states.telangana")}</option>
                        <option value="Uttar Pradesh">{t("contact.states.uttar_pradesh")}</option>
                      </motion.select>
                      <div className="select-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="form-field"
                    variants={formGroupVariants}
                  >
                    <label htmlFor="subject" className="field-label">
                      <span className="label-text">{t("contact.form.subject_label")}</span>
                      <span className="label-required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <motion.select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="field-select"
                        required
                        disabled={loading}
                        whileFocus={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      >
                        <option value="">{t("contact.form.subject_placeholder")}</option>
                        <option value="product-inquiry">{t("contact.subjects.product_inquiry")}</option>
                        <option value="order-support">{t("contact.subjects.order_support")}</option>
                        <option value="bulk-order">{t("contact.subjects.bulk_order")}</option>
                        <option value="partnership">{t("contact.subjects.partnership")}</option>
                        <option value="b2b-inquiry">{t("contact.subjects.b2b_inquiry")}</option>
                        <option value="feedback">{t("contact.subjects.feedback")}</option>
                        <option value="other">{t("contact.subjects.other")}</option>
                      </motion.select>
                      <div className="select-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 6h.008v.008H6V6z"
                          />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Message Field */}
                <motion.div className="form-field" variants={formGroupVariants}>
                  <label htmlFor="message" className="field-label">
                    <span className="label-text">{t("contact.form.message_label")}</span>
                  </label>
                  <div className="input-wrapper">
                    <motion.textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t("contact.form.message_placeholder")}
                      rows="6"
                      className="field-textarea"
                      disabled={loading}
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    />
                    <div className="textarea-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="modern-submit-btn"
                  disabled={loading}
                  variants={buttonVariants}
                  initial="initial"
                  whileHover={!loading ? "hover" : "loading"}
                  whileTap={!loading ? "tap" : {}}
                  animate={loading ? "loading" : "initial"}
                >
                  <span className="btn-content">
                    {loading ? (
                      <>
                        <motion.span
                          className="btn-spinner"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </motion.span>
                        <span>{t("contact.form.btn_sending")}</span>
                      </>
                    ) : (
                      <>
                        <span>{t("contact.form.btn_send")}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                          />
                        </svg>
                      </>
                    )}
                  </span>
                  <div className="btn-glow"></div>
                </motion.button>
              </motion.form>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ContactForm;
