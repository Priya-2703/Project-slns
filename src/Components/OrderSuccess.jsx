import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Check, Package, CreditCard, MapPin, Calendar } from "lucide-react";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;

  useEffect(() => {
    // ✅ If no order data, redirect to home
    if (!orderData) {
      navigate("/", { replace: true });
    }
  }, [orderData, navigate]);

  if (!orderData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-scaleIn">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <Check size={40} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-gray-400">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-gradient-to-br from-white/10 via-black/20 to-white/5 border border-white/20 rounded-3xl p-8 mb-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Order Number</p>
              <p className="text-white font-bold text-lg">
                {orderData.orderNumber}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Payment Status</p>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm">
                <Check size={14} />
                {orderData.paymentStatus}
              </span>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-white/10 pt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-white">
                ₹{orderData.subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Shipping</span>
              <span className="text-white">₹{orderData.shipping}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-white/10 pt-3">
              <span className="text-white">Total Paid</span>
              <span className="text-[#8E6740]">
                ₹{orderData.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="border-t border-white/10 mt-6 pt-4">
            <div className="flex items-center gap-2 text-sm">
              <CreditCard size={16} className="text-gray-400" />
              <span className="text-gray-400">Payment Method:</span>
              <span className="text-white font-medium">
                {orderData.paymentMethod}
              </span>
            </div>
            {orderData.paymentId && (
              <div className="text-xs text-gray-500 mt-1">
                Payment ID: {orderData.paymentId}
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-gradient-to-br from-white/10 via-black/20 to-white/5 border border-white/20 rounded-3xl p-6 mb-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Package size={20} className="text-[#8E6740]" />
            Order Items ({orderData.items?.length || 0})
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {orderData.items?.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 bg-black/30 rounded-xl"
              >
                <img
                  src={item.primary_image}
                  alt={item.product_name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-white font-medium text-sm line-clamp-1">
                    {item.product_name}
                  </p>
                  <p className="text-gray-400 text-xs">
                    Qty: {item.quantity} | Size: {item.selectedSize}
                  </p>
                </div>
                <p className="text-white font-semibold">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            to="/orders"
            className="flex-1 py-4 bg-gradient-to-r from-[#8E6740] to-[#6b4e2f] text-white rounded-xl font-semibold text-center hover:opacity-90 transition-all"
          >
            Track Order
          </Link>
          <Link
            to="/product"
            className="flex-1 py-4 bg-white/10 border border-white/20 text-white rounded-xl font-semibold text-center hover:bg-white/20 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
