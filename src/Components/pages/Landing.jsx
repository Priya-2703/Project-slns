import React, { lazy, Suspense, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { assets } from "../../../public/assets/asset";
import "./Landing.css";
import LoaderAni from "../LoaderAni";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
const Trending = lazy(() => import("./Trending"));
const NewArrival = lazy(() => import("./NewArrival"));
const Review = lazy(() => import("./Review"));

// 🎯 3D Banner Carousel Component
const BannerCarousel3D = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const adBanners = [
    {
      id: 1,
      title: "Festive Collection 2026",
      subtitle: "Premium Designer Sarees",
      image:
        "https://i.pinimg.com/736x/48/c0/b2/48c0b23c689e22115975c3de8414f9bb.jpg",
      gradient: "from-purple-600/40 to-pink-600/40",
    },
    {
      id: 2,
      title: "Traditional Elegance",
      subtitle: "Handwoven Silk Collection",
      image:
        "https://i.pinimg.com/1200x/9b/8b/31/9b8b3171fe1162ec7625c2de5c952f65.jpg",
      gradient: "from-blue-600/40 to-cyan-600/40",
    },
    {
      id: 3,
      title: "Limited Edition",
      subtitle: "Exclusive Designer Wear",
      image:
        "https://i.pinimg.com/1200x/0d/ef/2c/0def2c81113e494d166d77e62d8a28b1.jpg",
      gradient: "from-orange-600/40 to-amber-600/40",
    },
  ];

  // Auto-rotate every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % adBanners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [adBanners.length]);

  const getCardStyle = (index) => {
    const diff = (index - activeIndex + adBanners.length) % adBanners.length;

    if (diff === 0) {
      // Front card
      return {
        zIndex: 30,
        x: "0%",
        scale: 1,
        rotateY: 0,
        filter: "blur(0px)",
        opacity: 1,
      };
    } else if (diff === 1) {
      // Right card
      return {
        zIndex: 20,
        x: "65%",
        scale: 0.75,
        rotateY: -25,
        filter: "blur(3px)",
        opacity: 0.6,
      };
    } else {
      // Left card
      return {
        zIndex: 10,
        x: "-65%",
        scale: 0.75,
        rotateY: 25,
        filter: "blur(3px)",
        opacity: 0.6,
      };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full py-8 md:py-20 relative overflow-hidden"
    >
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6 }}
        className="text-center mb-3 md:mb-10"
      >
        <h2 className="text-white text-3xl md:text-5xl font-heading font-bold md:mb-3">
          {t("home.hero_carousel.special_offers")}
        </h2>
        <p className="text-white/60 text-[10px] md:text-base font-body">
          {t("home.hero_carousel.exclusive_deals")}
        </p>
      </motion.div>

      {/* 3D Carousel Container */}
      <div
        className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center"
        style={{ perspective: "2000px" }}
      >
        {adBanners.map((banner, index) => {
          const style = getCardStyle(index);
          const isActive = index === activeIndex;

          return (
            <motion.div
              key={banner.id}
              className="absolute w-[85%] md:w-[600px] lg:w-[700px] h-[350px] md:h-[450px] rounded-2xl overflow-hidden cursor-pointer"
              animate={style}
              transition={{
                duration: 0.7,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              onClick={() => setActiveIndex(index)}
              whileHover={
                isActive
                  ? {
                      scale: 1.02,
                      transition: { duration: 0.3 },
                    }
                  : {}
              }
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {/* Banner Image */}
              <div className="relative w-full h-full">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />

                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${banner.gradient}`}
                />
                <div className="absolute inset-0 bg-black/30" />

                {/* Content */}
                <motion.div
                  className="absolute inset-0 flex flex-col justify-center items-center text-center px-8"
                  animate={{
                    opacity: isActive ? 1 : 0,
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={
                      isActive ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }
                    }
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-white/90 text-xs md:text-sm font-body tracking-widest mb-3"
                  >
                    {banner.subtitle}
                  </motion.p>

                  <motion.h3
                    initial={{ y: 20, opacity: 0 }}
                    animate={
                      isActive ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }
                    }
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-white text-3xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 drop-shadow-2xl"
                  >
                    {banner.title}
                  </motion.h3>

                  <Link to={"/product"}>
                    <motion.button
                      initial={{ y: 20, opacity: 0 }}
                      animate={
                        isActive ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }
                      }
                      transition={{ delay: 0.4, duration: 0.5 }}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 30px rgba(149, 94, 48, 0.8)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-accet hover:bg-accet/90 text-white px-4 py-2 md:px-8 md:py-3 rounded-full font-body md:text-sm text-[10px] font-semibold shadow-xl transition-all duration-300"
                    >
                      Shop Now
                    </motion.button>
                  </Link>
                </motion.div>

                {/* Shimmer Effect on Active Card */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center items-center gap-3  md:mt-2">
        {adBanners.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setActiveIndex(index)}
            className="relative"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="md:w-2 md:h-2 w-1 h-1 rounded-full border-2 border-white/50"
              animate={{
                backgroundColor:
                  activeIndex === index ? "#955E30" : "transparent",
                borderColor: activeIndex === index ? "#955E30" : "#ffffff80",
                scale: activeIndex === index ? 1.3 : 1,
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Progress Ring */}
            {activeIndex === index && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-accet"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{
                  duration: 3,
                  ease: "linear",
                  repeat: Infinity,
                }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

const Landing = () => {
  const { t } = useTranslation();
  const images = [
    {
      img: "https://framerusercontent.com/images/Ji1Tq0FNqXyLQJOCZw9kgzRpR4.png",
      saree: "saree-1",
    },
    {
      img: "https://framerusercontent.com/images/tWKMGoRtLHSLshTSDTFvy8kb24.png",
      saree: "saree-2",
    },
    {
      img: "https://framerusercontent.com/images/gkVpU4bpMqOeoQhIKUMHCReH7qk.png",
      saree: "saree-3",
    },
    {
      img: "https://framerusercontent.com/images/8fwTncuBYaX8duI9rqZM9Y7IE.png",
      saree: "saree-4",
    },
    {
      img: "https://framerusercontent.com/images/gRDOSxiqX2M6P7Dl3iPCNYhfrjk.png",
      saree: "saree-5",
    },
    {
      img: "https://framerusercontent.com/images/O8McCVkRWTpwpPgP56Y0tqEVdc.jpg",
      saree: "saree-6",
    },
    {
      img: "https://framerusercontent.com/images/K9UYQClQVWlIFinPltO1lMZSKTY.png",
      saree: "saree-7",
    },
    {
      img: "https://framerusercontent.com/images/rMLx7KYhvktVqHLDnOv69GRit0.png",
      saree: "saree-8",
    },
    {
      img: "https://framerusercontent.com/images/tWKMGoRtLHSLshTSDTFvy8kb24.png",
      saree: "saree-9",
    },
    {
      img: "https://framerusercontent.com/images/d0pyAcCsn4jMUfU1bMcyuY0R8.png",
      saree: "saree-10",
    },
  ];

  //dynamic title
  useEffect(() => {
    document.title = `Welcome to SLNS Sarees`;
  }, []);

  // 🔹 Banner Carousel State
  const banners = [assets.banner, assets.banner2, assets.banner3];
  const [currentBanner, setCurrentBanner] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isBannerPaused, setIsBannerPaused] = useState(false);

  useEffect(() => {
    if (!isBannerPaused) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
        setDirection(1);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [banners.length, isBannerPaused]);

  // ⭐ NEW: Swipe power calculation
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  // ⭐ NEW: Paginate function
  const paginate = (newDirection) => {
    if (newDirection === 1) {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    } else {
      setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
    }
    setDirection(newDirection);
  };

  // Animation Variants - Mobile optimized
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const imageStagger = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const { scrollYProgress } = useScroll();
  const videoScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.15]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.4]);

  return (
    <>
      <div className="relative min-h-screen overflow-hidden">
        {/* 🔹 Fixed background video with parallax */}
        <motion.div
          className="h-screen relative"
          style={{ scale: videoScale, opacity: videoOpacity }}
        >
          <video
            src="https://framerusercontent.com/assets/qC6sPixgSS0GI7viRcrgOsxdwSQ.mp4"
            loop
            autoPlay
            muted
            playsInline
            preload="auto"
            className="fixed top-0 left-0 w-full h-full object-cover -z-20"
          />

          <div className="fixed top-0 w-full h-[70vh] bg-linear-to-b from-black to-transparent -z-10"></div>

          {/* 🔹 Top + Bottom Overlay (scrolls with content) */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute bottom-0 w-full h-screen bg-linear-to-t from-black to-black/5"></div>
          </div>
        </motion.div>
      </div>

      <div className="bg-black h-auto relative overflow-hidden">
        {/* next section - Welcome */}
        <motion.div
          className="w-full mx-auto flex justify-center items-center py-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeInUp}
        >
          <div className="flex flex-col justify-center items-center">
            <motion.h1
              className="capitalize tracking-wide text-[20px] font-heading font-[950] text-white"
              variants={fadeIn}
            >
              {t("home.welcome")}
            </motion.h1>
            <motion.img
              src={assets.logo}
              alt="logo"
              loading="lazy"
              className="w-[200px]"
              variants={scaleIn}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        {/* scroll saree with stagger animation */}
        <motion.div
          className="overflow-hidden relative grid grid-cols-1 py-4 bg-black"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          variants={staggerContainer}
        >
          <span className="bg-black w-full h-10 md:h-20 lg:h-32 rounded-[50%] top-[40px] md:top-[-10px] lg:top-[-30px] absolute z-30"></span>
          <div className="flex justify-center items-center gap-4 card-wrapper">
            {images.map((item, index) => {
              return (
                <motion.div
                  key={index}
                  className={`saree ${item.saree} flex flex-col justify-center items-center`}
                  variants={imageStagger}
                  whileHover={{
                    scale: 1,
                    y: -10,
                    transition: { duration: 0.3 },
                  }}
                >
                  <img
                    src={item.img}
                    alt={item.saree}
                    loading="lazy"
                    className="object-cover w-[180px] h-[250px] md:w-[200px] md:h-[350px] lg:w-[300px] lg:h-[500px] object-center"
                  />
                </motion.div>
              );
            })}
          </div>
          <span className="bg-black w-full h-10 md:h-20 lg:h-32 rounded-[50%] md:bottom-[-40px] bottom-[35px] lg:bottom-[-75px] absolute z-30"></span>
        </motion.div>

        {/* 🔹 CAROUSEL BANNER - Auto-change every 3 seconds */}
        <div
          className="relative w-full h-[120px] md:h-[200px] lg:h-[400px] mx-auto flex justify-center items-start overflow-hidden my-8 md:my-10 lg:my-20"
          onMouseEnter={() => setIsBannerPaused(true)}
          onMouseLeave={() => setIsBannerPaused(false)}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentBanner}
              custom={direction}
              className="absolute w-full h-full shadow-2xl"
              initial={(direction) => ({
                x: direction > 0 ? 1000 : -1000,
                opacity: 0,
              })}
              animate={{
                x: 0,
                opacity: 1,
                boxShadow: [
                  "0 0 20px #ff0080",
                  "0 0 20px #ff8c00",
                  "0 0 20px #955E30",
                  "0 0 20px #ffffff",
                ],
              }}
              exit={(direction) => ({
                x: direction < 0 ? 1000 : -1000,
                opacity: 0,
              })}
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                boxShadow: { duration: 2, repeat: Infinity },
              }}
              whileHover={{ scale: 1.02 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
            >
              <img
                src={banners[currentBanner]}
                alt={`banner-${currentBanner + 1}`}
                loading="lazy"
                className="object-cover w-full h-full object-top pointer-events-none select-none"
                draggable="false"
              />
            </motion.div>
          </AnimatePresence>

          {/* 🔹 Indicator Dots */}
          <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-0.5 md:gap-2 z-10">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentBanner(index);
                  setDirection(index > currentBanner ? 1 : -1);
                }}
                className={`md:w-2 md:h-2 w-1 h-1 rounded-full transition-all duration-300 ${
                  currentBanner === index
                    ? "bg-white w-3 md:w-6"
                    : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Elevating Your Style */}
        <motion.div
          className="w-full mx-auto py-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          variants={fadeInUp}
        >
          <div className="flex flex-col justify-center items-center text-white">
            <motion.h1
              className="text-[30px] md:text-[48px] font-[950] md:py-3 lg:py-5 font-heading capitalize leading-13 md:leading-8"
              variants={fadeInUp}
            >
              {t("home.style_section.title")}
            </motion.h1>
            <motion.p
              className="w-[90%] md:w-[60%] lg:w-[40%] text-[8px] md:text-[12px] font-body tracking-wide font-thin capitalize text-center"
              variants={fadeIn}
            >
              {t("home.style_section.subtitle")}
            </motion.p>
          </div>

          {/* Grid with stagger animation */}
          <motion.div
            className="w-[90%] h-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-6 md:mt-8 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.05 }}
          >
            {/* Column 1 */}
            <motion.div className="grid grid-cols-1" variants={slideInLeft}>
              <div className="flex flex-col gap-4">
                <motion.div
                  className="relative h-[500px] w-full card rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 border border-gray-700 justify-start overflow-hidden box1"
                  whileHover={{
                    borderColor: "#C9463B",
                    transition: { duration: 0.3 },
                  }}
                >
                  <h1 className="font-spectral text-center text-[30px] uppercase text-white leading-[40px] py-3">
                    {t("home.grid.banarasi")}
                  </h1>
                  <p className="font-body tracking-wide text-[12px] text-white/65 text-center py-4">
                    {t("home.grid.banarasi_desc")}
                  </p>
                  <div className="absolute bottom-[-70px] flex justify-center w-full">
                    <img
                      src={assets.box1}
                      alt="Banarasi saree"
                      className="w-52"
                    />
                  </div>
                </motion.div>
                <motion.div
                  className="relative h-[300px] w-full card rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 border border-gray-700 justify-start overflow-hidden box2"
                  whileHover={{
                    borderColor: "#ff8c00",
                    transition: { duration: 0.3 },
                  }}
                >
                  <h1 className="font-spectral font-[950] text-center text-[30px] uppercase text-white leading-[40px] py-3">
                    {t("home.grid.mysore")}
                  </h1>
                  <div className="absolute bottom-[-120px] flex justify-center w-full">
                    <img
                      src={assets.box2}
                      alt="Mysore saree"
                      className="w-52"
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Column 2 */}
            <motion.div className="grid grid-cols-1" variants={scaleIn}>
              <motion.div
                className="relative h-[814px] w-full card rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 border border-gray-700 justify-center overflow-hidden box3"
                whileHover={{
                  borderColor: "#955E30",
                  transition: { duration: 0.3 },
                }}
              >
                <div className="absolute top-[-180px] left-0">
                  <img
                    src={assets.box31}
                    alt="Kanchipuram saree"
                    className="w-[850px] box31"
                  />
                </div>
                <h1 className="font-spectral text-center text-[30px] uppercase text-white leading-10 py-3">
                  {t("home.grid.kanchipuram")}
                </h1>
                <p className="font-body text-[12px] tracking-wide text-white/65 text-center py-4">
                  {t("home.grid.kanchipuram_desc")}
                </p>
                <div className="absolute bottom-[-180px] flex justify-center w-full">
                  <img
                    src={assets.box32}
                    alt="Kanchipuram saree"
                    className="w-[340px] box32"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Column 3 */}
            <motion.div className="grid grid-col-1" variants={slideInRight}>
              <div className="flex flex-col md:flex-row lg:flex-col gap-4">
                <motion.div
                  className="relative h-[300px] w-full lg:w-full md:w-[350px] card rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 border border-gray-700 justify-start overflow-hidden box4"
                  whileHover={{
                    borderColor: "#00ff88",
                    transition: { duration: 0.3 },
                  }}
                >
                  <h1 className="font-spectral text-center text-[30px] uppercase text-white leading-[40px] py-3">
                    {t("home.grid.pochampally")}
                  </h1>

                  <div className="absolute bottom-[-170px] right-0 md:right-10 lg:right-0">
                    <img
                      src={assets.box4}
                      alt="Pochampally saree"
                      className="w-64"
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="relative h-[500px] md:h-[300px] lg:h-[500px] w-full md:w-[350px] lg:w-full card rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 border border-gray-700 justify-start overflow-hidden box5"
                  whileHover={{
                    borderColor: "#ff00ff",
                    transition: { duration: 0.3 },
                  }}
                >
                  <h1 className="font-spectral text-center md:text-[23px] lg:text-[30px] text-[30px] uppercase text-white leading-[40px] pt-4">
                    {t("home.grid.cotton")}
                  </h1>
                  <p className="font-body tracking-wide lg:tracking-wide md:tracking-normal text-[12px] lg:text-[12px] md:text-[10px] text-white/65 text-center py-4 md:py-1 lg:py-4">
                    {t("home.grid.cotton_desc")}
                  </p>
                  <div className="absolute lg:bottom-[-180px] md:bottom-[-220px] bottom-[-180px] flex justify-center w-full">
                    <img
                      src={assets.box5}
                      alt="Cotton saree"
                      className="w-96"
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* TRENDING NOW */}
        <Suspense fallback={<LoaderAni />}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Trending />
          </motion.div>
        </Suspense>

        {/* NEW ARRIVALS*/}
        <Suspense fallback={<LoaderAni />}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <NewArrival />
          </motion.div>
        </Suspense>

        {/* 🎯 3D BANNER CAROUSEL - NEW SECTION */}
        <BannerCarousel3D />

        {/* Review*/}
        <Suspense fallback={<LoaderAni />}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Review />
          </motion.div>
        </Suspense>
      </div>
    </>
  );
};

export default Landing;
