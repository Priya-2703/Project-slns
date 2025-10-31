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
const Trending = lazy(() => import("./Trending"));
const NewArrival = lazy(() => import("./NewArrival"));
const Review = lazy(() => import("./Review"));

const Landing = () => {
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

  // 🔹 Banner Carousel State
  const banners = [
    assets.banner,
    assets.banner2, // Replace with assets.banner2
    assets.banner3, // Replace with assets.banner3
  ];

  const [currentBanner, setCurrentBanner] = useState(0);

  // 🔹 Auto-change banner every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [banners.length]);

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
              Welcome To
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
        <div className="relative w-full h-[200px] lg:h-[400px] mx-auto flex justify-center items-start overflow-hidden my-20 lg:my-40">
          <AnimatePresence initial={false} custom={currentBanner}>
            <motion.div
              key={currentBanner}
              custom={currentBanner}
              className="absolute w-full h-full shadow-2xl"
              initial={{ x: 600, opacity: 0 }}
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
              exit={{ x: -600, opacity: 0 }}
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
              }}
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={banners[currentBanner]}
                alt={`banner-${currentBanner + 1}`}
                loading="lazy"
                className="object-cover w-full h-full object-top"
              />
            </motion.div>
          </AnimatePresence>

          {/* 🔹 Indicator Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentBanner === index ? "bg-white w-6" : "bg-white/50"
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
              className="text-[40px] md:text-[65px] font-[950] md:py-5 font-heading capitalize leading-13 md:leading-14"
              variants={fadeInUp}
            >
              Elevating Your Style
            </motion.h1>
            <motion.p
              className="w-[90%] md:w-[40%] text-[8px] md:text-[12px] font-body tracking-wide font-thin capitalize text-center"
              variants={fadeIn}
            >
              Discover the Perfect Blend of Comfort and Trend with Our Exclusive
              Collection. Explore Deals on Jeans, Sneakers, and More!
            </motion.p>
          </div>

          {/* Grid with stagger animation */}
          <motion.div
            className="w-[90%] h-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-6 mt-8 gap-4"
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
                    Banarasi Silk Sarees
                  </h1>
                  <p className="font-body tracking-wide text-[12px] text-white/65 text-center py-4">
                    Traditionally, Banarasi sarees were woven exclusively for
                    royalty and aristocracy, and they remain a popular choice
                    for weddings, grand celebrations, and festive occasions.
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
                    Mysore silk sarees
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
                  Kanchipuram Silk sarees
                </h1>
                <p className="font-body text-[12px] tracking-wide text-white/65 text-center py-4">
                  Explore exclusive deals on our top products. The perfect
                  opportunity to enrich your wardrobe with trendy pieces at
                  affordable prices.
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
                    Pochampally sarees
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
                    Cotton sarees
                  </h1>
                  <p className="font-body tracking-wide lg:tracking-wide md:tracking-normal text-[12px] lg:text-[12px] md:text-[10px] text-white/65 text-center py-4 md:py-1 lg:py-4">
                    Passion for fashion and comfort is reflected in every pair
                    of sneakers. Experience style and functionality in a single
                    step.
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
