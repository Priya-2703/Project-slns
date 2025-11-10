// src/pages/PaymentSuccess.jsx

import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaDownload, FaHome } from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
import { getImageUrl } from "../utils/imageHelper";

function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const paymentData = location.state;

  useEffect(() => {
    // ✅ No payment data means direct access - redirect to home
    if (!paymentData) {
      navigate("/", { replace: true });
    }
  }, [paymentData, navigate]);

  useEffect(() => {
    document.title = "Payment Success - SLNS Sarees";
  }, []);

  if (!paymentData) return null;

  const currency = (n) =>
    n.toLocaleString("en-IN", { style: "currency", currency: "INR" });

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const checkmarkVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.6,
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-black text-white py-20 px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-4xl mx-auto">
        {/* Success Icon */}
        <motion.div
          className="flex justify-center mb-8"
          variants={checkmarkVariants}
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <FaCheckCircle className="text-green-500 text-8xl relative z-10" />
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Payment Successful! 🎉
          </h1>
          <p className="text-neutral-400 font-body text-lg">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </motion.div>

        {/* Payment Details Card */}
        <motion.div
          variants={itemVariants}
          className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 md:p-8 mb-6"
        >
          <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3">
            <FiPackage className="text-[#815a37]" />
            Order Details
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <DetailRow label="Order ID" value={paymentData.orderId} />
            <DetailRow label="Payment ID" value={paymentData.paymentId} />
            <DetailRow
              label="Payment Status"
              value={
                <span className="text-green-500 font-semibold">
                  {paymentData.paymentStatus}
                </span>
              }
            />
            <DetailRow
              label="Payment Method"
              value={paymentData.paymentMethod}
            />
            <DetailRow
              label="Order Date"
              value={new Date(paymentData.orderDate).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            />
            <DetailRow
              label="Total Amount"
              value={
                <span className="text-xl font-bold text-[#815a37]">
                  {currency(paymentData.total)}
                </span>
              }
            />
          </div>

          {/* Order Items */}
          <div className="border-t border-neutral-800 pt-6">
            <h3 className="text-xl font-heading font-semibold mb-4">
              Items Purchased ({paymentData.items.length})
            </h3>

            <div className="space-y-4">
              {paymentData.items.map((item, index) => (
                <motion.div
                  key={item.product_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 bg-black/30 rounded-lg p-4"
                >
                  <img
                    src={getImageUrl(item.primary_image)}
                    alt={item.product_name}
                    className="w-16 h-20 object-cover rounded-lg ring-1 ring-neutral-700"
                  />
                  <div className="flex-1">
                    <h4 className="font-body font-semibold text-sm mb-1">
                      {item.product_name}
                    </h4>
                    <p className="text-xs text-neutral-400">
                      {item.category_name}
                    </p>
                    {item.selectedSize && (
                      <p className="text-xs text-neutral-400 mt-1">
                        Size: {item.selectedSize}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-body text-sm text-neutral-400">
                      Qty: {item.quantity}
                    </p>
                    <p className="font-body font-semibold">
                      {currency(item.price * item.quantity)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="border-t border-neutral-800 mt-6 pt-6 space-y-3">
            <div className="flex justify-between font-body text-sm">
              <span className="text-neutral-400">Subtotal</span>
              <span>{currency(paymentData.subtotal)}</span>
            </div>
            <div className="flex justify-between font-body text-sm">
              <span className="text-neutral-400">Shipping</span>
              <span>{currency(paymentData.shipping)}</span>
            </div>
            <div className="flex justify-between font-body text-lg font-bold border-t border-neutral-700 pt-3">
              <span>Total Paid</span>
              <span className="text-[#815a37]">
                {currency(paymentData.total)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row gap-4 justify-center"
        >

          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 bg-[#815a37] hover:bg-[#8f673f] text-white px-6 py-3 rounded-full font-body font-semibold transition-colors w-full md:w-auto"
            >
              <FaHome />
              Back to Home
            </motion.button>
          </Link>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          variants={itemVariants}
          className="mt-8 text-center text-neutral-400 text-sm font-body"
        >
          <p>Order confirmation has been sent to your email.</p>
          <p className="mt-2">
            For any queries, contact us at{" "}
            <a
              href="mailto:support@slnssarees.com"
              className="text-[#815a37] hover:underline"
            >
              support@slnssarees.com
            </a>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Helper Component
function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-neutral-400 text-sm font-body mb-1">{label}</span>
      <span className="font-body font-semibold">{value}</span>
    </div>
  );
}

export default PaymentSuccess;
