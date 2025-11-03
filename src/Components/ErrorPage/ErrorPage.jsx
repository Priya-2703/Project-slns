// src/pages/ErrorPage.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, AlertTriangle } from "lucide-react";

const ErrorPage = () => {

    //dynamic title
  useEffect(() => {
  document.title = `404 - SLNS Sarees`;
}, []);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, 0.05, 0.01, 0.9],
      },
    },
  };

  const numberVariants = {
    hidden: { opacity: 0, scale: 0.5, rotateY: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.05, 0.01, 0.9],
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        "0 0 20px rgba(129, 90, 55, 0.3)",
        "0 0 60px rgba(129, 90, 55, 0.6)",
        "0 0 20px rgba(129, 90, 55, 0.3)",
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-black text-white flex items-center justify-center px-4 overflow-hidden relative"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/5 rounded-full"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl w-full mx-auto text-center relative z-10">
        {/* 404 Number with Animation */}
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="mb-8"
        >
          <div className="flex justify-center items-center gap-4 md:gap-8">
            {["4", "0", "4"].map((num, index) => (
              <motion.div
                key={index}
                variants={numberVariants}
                custom={index}
                className="relative"
              >
                <motion.h1
                  variants={glowVariants}
                  animate="animate"
                  className="text-[100px] md:text-[200px] lg:text-[280px] font-heading font-[950] leading-none bg-linear-to-br from-white via-gray-300 to-gray-600 bg-clip-text text-transparent"
                  style={{
                    textShadow: "0 0 80px rgba(255, 255, 255, 0.5)",
                  }}
                >
                  {num}
                </motion.h1>
                {/* Glowing Effect */}
                <motion.div
                  className="absolute inset-0 blur-3xl opacity-30"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="w-full h-full bg-linear-to-br from-[#815a37] to-white" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Icon with Animation */}
        <motion.div
          variants={itemVariants}
          className="mb-6 flex justify-center"
        >
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="bg-linear-to-br from-[#815a37] to-[#bb5e00] p-4 md:p-6 rounded-full"
          >
            <AlertTriangle size={40} className="md:w-16 md:h-16" />
          </motion.div>
        </motion.div>

        {/* Error Message */}
        <motion.div variants={itemVariants} className="mb-4">
          <h2 className="text-[28px] md:text-[48px] lg:text-[60px] font-heading font-[950] mb-4 bg-linear-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-400 text-[14px] md:text-[18px] lg:text-[20px] font-body max-w-2xl mx-auto mb-2">
            The page you're looking for seems to have wandered off into the digital void.
          </p>
          <p className="text-gray-500 text-[12px] md:text-[16px] font-body">
            Don't worry, even the best explorers get lost sometimes!
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 md:mt-12"
        >
          <Link to="/">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 60px rgba(129, 90, 55, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="group flex items-center gap-3 bg-linear-to-r from-[#815a37] to-[#bb5e00] text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-body font-semibold text-[14px] md:text-[16px] shadow-lg shadow-[#815a37]/50"
            >
              <Home size={20} />
              Back to Home
              <motion.span
                className="inline-block"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.button>
          </Link>

          <Link to="/product">
            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="flex items-center gap-3 bg-white/5 border-2 border-white/20 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-body font-semibold text-[14px] md:text-[16px] backdrop-blur-lg hover:border-white/40"
            >
              <Search size={20} />
              Browse Products
            </motion.button>
          </Link>
        </motion.div>

        {/* Go Back Link */}
        <motion.div variants={itemVariants} className="mt-8 md:mt-12">
          <motion.button
            whileHover={{ x: -5 }}
            transition={{ duration: 0.3 }}
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white font-body text-[13px] md:text-[15px] transition-colors duration-300"
          >
            <ArrowLeft size={18} />
            Go back to previous page
          </motion.button>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          variants={itemVariants}
          className="mt-12 md:mt-16 flex justify-center gap-2"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-linear-to-r from-[#815a37] to-[#bb5e00] rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Corner Decoration */}
      <motion.div
        className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-[#815a37]/20 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-64 h-64 bg-linear-to-tr from-[#bb5e00]/20 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </motion.div>
  );
};

export default ErrorPage;