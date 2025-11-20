import { useContext, useEffect, useMemo, useState } from "react";
import { FaArrowLeft, FaMinus, FaPlus } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../../../public/assets/asset";
import { CartContext } from "../../Context/UseCartContext";
import { motion } from "framer-motion";
import { getImageUrl } from "../../utils/imageHelper";

function Cart() {
  const navigate = useNavigate();
  const {
    cart,
    totalPrice,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
  } = useContext(CartContext);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    document.title = `Cart (${cart.length}) - SLNS Sarees`;
  }, [cart.length]);

  console.log("cart", cart);

  // Replace your handleCheckout function with this:

  const handleCheckout = () => {
    navigate("/checkout");
  };

  // Math
  const currency = (n) =>
    n.toLocaleString("en-IN", { style: "currency", currency: "INR" });

  const subtotal = useMemo(
    () => cart.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [cart]
  );

  // Optional: basic delivery fee logic (edit/Remove if not needed)
  const shipping = subtotal > 1000 && subtotal < 7000 ? 0 : 100;

  // Enhanced Modern Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: -50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.6, 0.05, 0.01, 0.9],
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9,
      rotateX: -10,
    },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
      },
    }),
    exit: {
      opacity: 0,
      x: -100,
      scale: 0.8,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const summaryVariants = {
    hidden: {
      opacity: 0,
      x: 100,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.3,
        type: "spring",
        stiffness: 80,
      },
    },
  };

  const backButtonVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      rotate: -180,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.7,
        ease: [0.34, 1.56, 0.64, 1],
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  };

  const emptyCartVariants = {
    hidden: {
      opacity: 0,
      scale: 0.5,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.34, 1.56, 0.64, 1],
        type: "spring",
      },
    },
  };

  const headerTableVariants = {
    hidden: {
      opacity: 0,
      y: -20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-black text-white mt-20 md:mt-28"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        variants={backButtonVariants}
        className="absolute top-[90px] left-5 md:top-[130px] lg:top-[154px] md:left-[30px] lg:left-[100px] z-20"
        whileHover={{
          scale: 1.1,
          rotate: -5,
        }}
        whileTap={{ scale: 0.9 }}
      >
        <Link
          to={"/product"}
          aria-label="Go to product details"
          title="Go to Product"
          className="group inline-flex items-center justify-center rounded-full border border-neutral-700 bg-black p-2 text-gray-300 hover:text-white hover:border-gray-500 focus:outline-none backdrop-blur"
        >
          <motion.div whileHover={{ x: -3 }} transition={{ duration: 0.3 }}>
            <FaArrowLeft className="text-white text-[12px] md:text-[18px]" />
          </motion.div>
        </Link>
      </motion.div>

      <div className="w-[90%] lg:w-[80%] mx-auto flex justify-center items-center py-3 px-10">
        <motion.h1
          variants={titleVariants}
          className="mb-8 text-[20px] md:text-[50px] font-[950] font-heading capitalize text-white"
        >
          Shopping Cart
        </motion.h1>
      </div>

      <div className="mx-auto max-w-[90%] px-4 py-2 md:py-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* mobile view */}
          <section className="grid md:hidden grid-cols-1 gap-3 mb-[350px]">
            {cart.length === 0 ? (
              <motion.div
                variants={emptyCartVariants}
                className="p-8 text-center font-body text-[13px] text-neutral-400"
              >
                Your cart is empty.
              </motion.div>
            ) : (
              cart.map((it, index) => {
                const line = it.quantity * it.price;
                return (
                  <motion.div
                    key={it.product_id}
                    variants={itemVariants}
                    custom={index}
                    layout
                    whileHover={{
                      scale: 1.02,
                      y: -4,
                      transition: { duration: 0.3 },
                    }}
                    className="w-full bg-linear-to-br from-white/10 via-black/10 to-white/10 border border-white/20 rounded-xl px-3 py-3"
                  >
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex justify-center items-center gap-3">
                        <Link
                          to={`/product/${it.product_id}`}
                          className="flex items-center gap-4"
                        >
                          <motion.img
                            src={getImageUrl(it.primary_image)}
                            alt={it.product_name}
                            className="h-[100px] w-[60px] rounded-lg object-cover ring-1 ring-neutral-800"
                            whileHover={{
                              scale: 1.08,
                              rotate: 3,
                              transition: { duration: 0.3 },
                            }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                          />
                        </Link>
                        <div className="flex flex-col gap-2 items-start justify-center">
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                            className="w-full"
                          >
                            <p className="font-medium text-[12px] max-w-60 font-body text-white leading-5 line-clamp-2 ">
                              {it.product_name}
                            </p>
                            <p className="text-[8px] font-body text-neutral-400 mt-1">
                              {it.category_name}
                            </p>
                            {/* ✅ SIZE DISPLAY - Mobile */}
                            {it.selectedSize && (
                              <motion.button
                                onClick={() => handleSizeClick(it)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="mt-2 inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md px-2 py-1 transition-colors"
                              >
                                <span className="text-gray-400 text-[8px] font-body">
                                  Size:
                                </span>
                                <span className="text-white font-bold text-[8px] font-body">
                                  {it.selectedSize}
                                </span>
                              </motion.button>
                            )}
                          </motion.div>
                          <div className="w-full flex justify-between items-center">
                            <motion.div
                              className="text-center font-body text-[12px] font-medium tabular-nums"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.1 + 0.4 }}
                            >
                              {currency(line)}
                            </motion.div>

                            <div className="flex justify-center items-center mx-3">
                              <motion.button
                                onClick={() => removeFromCart(it)}
                                className="h-5 w-5 inline-flex items-center justify-center rounded-full hover:bg-neutral-800 text-neutral-300"
                                aria-label="Remove item"
                                whileHover={{
                                  scale: 1.3,
                                  rotate: 15,
                                  color: "#ef4444",
                                }}
                                whileTap={{ scale: 0.85 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                <FaTrashCan />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-center">
                        <motion.div
                          className="flex flex-col items-center gap-4 rounded-[10px] border border-neutral-800 bg-gray-900/40 py-3"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                        >
                          <motion.button
                            onClick={() =>
                              updateCartItemQuantity(it.product_id, -1)
                            }
                            className="h-3 w-3 inline-flex items-center justify-center rounded-full hover:bg-neutral-800"
                            aria-label="Decrease"
                            whileHover={{ scale: 1.4 }}
                            whileTap={{ scale: 0.75 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <FaMinus />
                          </motion.button>
                          <motion.input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            min={1}
                            value={it.quantity}
                            readOnly
                            className="w-10 bg-transparent text-[16px] font-body text-center outline-none"
                            key={it.quantity}
                            initial={{ scale: 1.3, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                          <motion.button
                            onClick={() =>
                              updateCartItemQuantity(it.product_id, 1)
                            }
                            className="h-3 w-3 inline-flex items-center justify-center rounded-full hover:bg-neutral-800"
                            aria-label="Increase"
                            whileHover={{ scale: 1.4 }}
                            whileTap={{ scale: 0.75 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <FaPlus />
                          </motion.button>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </section>

          {/* Items */}
          <section className="lg:col-span-2 hidden md:block">
            <motion.div
              variants={itemVariants}
              custom={0}
              className="w-full rounded-2xl  bg-linear-to-br from-white/5 via-black/10 to-white/5 border border-white/20 "
            >
              <motion.div
                variants={headerTableVariants}
                className="lg:w-full grid grid-cols-12 px-4 py-4 text-[12px] font-body uppercase text-neutral-400"
              >
                <div className="col-span-5">Product</div>
                <div className="col-span-2 text-center">Size</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Total</div>
                <div className="col-span-1 text-right">Action</div>
              </motion.div>
              <div className="h-px bg-neutral-800" />

              {cart.length === 0 ? (
                <motion.div
                  variants={emptyCartVariants}
                  className="p-8 text-center font-body text-[13px] text-neutral-400"
                >
                  Your cart is empty.
                </motion.div>
              ) : (
                cart.map((it, index) => {
                  const line = it.quantity * it.price;
                  return (
                    <motion.div
                      key={it.product_id}
                      variants={itemVariants}
                      custom={index + 1}
                      layout
                      whileHover={{
                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                        scale: 1.01,
                        transition: { duration: 0.3 },
                      }}
                      className="w-full grid grid-cols-12 items-center gap-10 px-5 py-4"
                    >
                      {/* product info */}
                      <div className="col-span-5 flex items-center gap-4">
                        <Link
                          to={`/product/${it.product_id}`}
                          className="flex items-center gap-4"
                        >
                          <motion.img
                            src={getImageUrl(it.primary_image)}
                            alt={it.product_name}
                            className="max-w-18 max-h-20 rounded-lg object-cover ring-1 ring-neutral-800"
                            whileHover={{
                              scale: 1.15,
                              rotate: 5,
                              boxShadow: "0 10px 30px rgba(129, 90, 55, 0.3)",
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 15,
                            }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            layoutId={`image-${it.id}`}
                          />
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                          >
                            <p className="font-bold font-body text-[13px] text-white leading-5 line-clamp-2">
                              {it.product_name}
                            </p>
                            <p className="text-[10px] uppercase font-body text-neutral-400 mt-1">
                              {it.category_name}
                            </p>
                          </motion.div>
                        </Link>
                      </div>

                      {/* size info */}
                      <div className="col-span-2 flex justify-center">
                        {it.selectedSize && it.selectedSize !== "One Size" ? (
                          <motion.button
                            whileHover={{ scale: 1.05, borderColor: "#815a37" }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-full px-4 py-2 transition-all group"
                          >
                            <span className="text-gray-400 text-[12px] font-body group-hover:text-white">
                              Size:
                            </span>
                            <span className="text-white font-bold text-[12px] font-body">
                              {it.selectedSize}
                            </span>
                          </motion.button>
                        ) : (
                          <span className="text-gray-500 text-[10px] font-body">
                            {it.selectedSize === "One Size" ? "N/A" : "N/A"}
                          </span>
                        )}
                      </div>

                      {/* Quantity */}
                      <div className="col-span-2 flex justify-center">
                        <motion.div
                          className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900 px-2 py-1"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                          whileHover={{
                            borderColor: "#815a37",
                            scale: 1.05,
                          }}
                        >
                          <motion.button
                            onClick={() => updateCartItemQuantity(it, -1)}
                            className="h-5 w-5 inline-flex items-center justify-center rounded-full hover:bg-neutral-800"
                            aria-label="Decrease"
                            whileHover={{
                              scale: 1.3,
                              backgroundColor: "#815a37",
                            }}
                            whileTap={{ scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <FaMinus />
                          </motion.button>
                          <motion.input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            min={1}
                            value={it.quantity}
                            readOnly
                            className="w-10 bg-transparent font-body text-center outline-none"
                            key={it.quantity}
                            initial={{ scale: 1.3, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                          <motion.button
                            onClick={() => updateCartItemQuantity(it, 1)}
                            className="h-5 w-5 inline-flex items-center justify-center rounded-full hover:bg-neutral-800"
                            aria-label="Increase"
                            whileHover={{
                              scale: 1.3,
                              backgroundColor: "#815a37",
                            }}
                            whileTap={{ scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <FaPlus />
                          </motion.button>
                        </motion.div>
                      </div>

                      {/* Total info */}
                      <motion.div
                        className="col-span-2 text-center font-body font-medium tabular-nums"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.4 }}
                      >
                        {currency(line)}
                      </motion.div>

                      {/* Action info */}
                      <div className="col-span-1 flex justify-center items-center">
                        <motion.button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeFromCart(it);
                          }}
                          className="h-5 w-5 inline-flex items-center justify-center rounded-full hover:bg-neutral-800 text-neutral-300"
                          aria-label="Remove item"
                          whileHover={{
                            scale: 1.4,
                            rotate: 20,
                            color: "#ef4444",
                            backgroundColor: "rgba(239, 68, 68, 0.1)",
                          }}
                          whileTap={{ scale: 0.85 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <FaTrashCan />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </section>

          {/* Summary */}
          <aside className="lg:col-span-1 ">
            <motion.div
              variants={summaryVariants}
              className="rounded-t-2xl fixed bottom-0 left-0 right-0 lg:sticky lg:top-24 w-full lg:w-auto lg:rounded-2xl bg-linear-to-br from-white/10 via-black/10 to-white/10 border border-white/20 z-50 p-5"
              // whileHover={{
              //   borderColor: "#815a37",
              //   transition: { duration: 0.3 },
              // }}
            >
              <motion.h3
                className="mb-1 text-[25px] font-heading capitalize font-[950]"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Order Summary
              </motion.h3>
              <div className="my-5 h-px bg-neutral-800" />

              <div className="font-body text-[14px] flex flex-col gap-3">
                <SummaryRow
                  label="Total no. of Items"
                  value={cart.reduce((sum, it) => sum + it.quantity, 0)}
                  delay={0.6}
                />
                <SummaryRow
                  label="Sub Total"
                  value={currency(subtotal)}
                  delay={0.7}
                />
                <SummaryRow
                  label="Delivery fee"
                  value={currency(cart.length ? shipping : 0)}
                  delay={0.8}
                />
                <div className="my-4 h-px bg-neutral-800" />
                <SummaryRow
                  label="Total"
                  value={currency(cart.length ? totalPrice : 0)}
                  bold
                  large
                  delay={0.9}
                />
              </div>

              <motion.button
                onClick={handleCheckout} // ✅ Itha add pannunga
                disabled={cart.length === 0 || isProcessing}
                className="mt-5 w-full rounded-full cursor-pointer font-body hover:bg-accet px-5 py-3 font-semibold text-white  bg-accet/30 hover:border-0 border border-accet transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                whileHover={{
                  scale: cart.length === 0 || isProcessing ? 1 : 1.05,
                  boxShadow:
                    cart.length === 0 || isProcessing
                      ? "none"
                      : "0 10px 40px rgba(129, 90, 55, 0.4)",
                }}
                whileTap={{
                  scale: cart.length === 0 || isProcessing ? 1 : 0.95,
                }}
              >
                {isProcessing ? "Processing..." : "Checkout Now"}
              </motion.button>
            </motion.div>
          </aside>
        </div>
      </div>
      {/* 
      <SizeChangeModal
        isOpen={sizeModalOpen}
        onClose={() => {
          setSizeModalOpen(false);
          setSelectedProduct(null);
        }}
        currentSize={selectedProduct?.selectedSize}
        availableSizes={selectedProduct?.sizes || []}
        onSizeChange={handleSizeChange}
        productName={selectedProduct?.product_name}
      /> */}
    </motion.div>
  );
}

/* UI helpers */
function SummaryRow({ label, value, bold = false, large = false, delay = 0 }) {
  return (
    <motion.div
      className="flex items-center justify-between"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.5,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        x: 5,
        transition: { duration: 0.2 },
      }}
    >
      <span
        className={[
          "text-neutral-300",
          bold ? "font-semibold" : "",
          large ? "text-base" : "text-sm",
        ].join(" ")}
      >
        {label}
      </span>
      <motion.span
        className={[
          "tabular-nums",
          bold ? "font-semibold" : "",
          large ? "text-base" : "text-sm",
        ].join(" ")}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.1 }}
      >
        {value}
      </motion.span>
    </motion.div>
  );
}
export default Cart;
