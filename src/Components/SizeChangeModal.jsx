import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const SizeChangeModal = ({
  isOpen,
  onClose,
  currentSize,
  availableSizes,
  onSizeChange,
  productName,
}) => {
  const [selectedSize, setSelectedSize] = useState(currentSize);

  // Update selected size when current size changes
  useEffect(() => {
    setSelectedSize(currentSize);
    console.log("available size", availableSizes);
  }, [currentSize]);

  const handleConfirm = () => {
    if (selectedSize && selectedSize !== currentSize) {
      onSizeChange(selectedSize);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-heading font-bold text-white mb-1">
                    Change Size
                  </h2>
                  <p className="text-gray-400 text-sm font-body line-clamp-1">
                    {productName}
                  </p>
                </div>
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Current Size Info */}
              <div className="mb-6 p-3 bg-white/5 rounded-xl border border-white/10">
                <p className="text-gray-400 text-xs mb-1 font-body">
                  Current Size:
                </p>
                <p className="text-white font-bold text-lg font-body">
                  {currentSize}
                </p>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <p className="text-gray-300 text-sm mb-3 font-body">
                  Select New Size:
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {availableSizes.map((size) => (
                    <motion.button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`py-3 px-4 rounded-xl font-body font-semibold text-sm transition-all ${
                        selectedSize === size
                          ? "bg-white text-black shadow-lg shadow-white/20"
                          : currentSize === size
                          ? "bg-gray-700 text-gray-300 border border-gray-600"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700"
                      }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Info Message */}
              {selectedSize !== currentSize && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl"
                >
                  <p className="text-blue-400 text-xs font-body">
                    📏 Size will be changed from <strong>{currentSize}</strong>{" "}
                    to <strong>{selectedSize}</strong>
                  </p>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 py-3 bg-gray-800 text-white rounded-xl font-body font-semibold hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirm}
                  disabled={selectedSize === currentSize}
                  className={`flex-1 py-3 rounded-xl font-body font-semibold transition-all ${
                    selectedSize === currentSize
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-white text-black hover:bg-gray-200"
                  }`}
                >
                  Confirm Change
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SizeChangeModal;
