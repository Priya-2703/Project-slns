"use client";
import React, { useEffect, useRef, useState } from "react";
import { assets } from "../../../public/assets/asset";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";

const Trending = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const [swiperReady, setSwiperReady] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [locked, setLocked] = useState(false); // no overflow

  const products = [
    {
      img: `${assets.poc1}`,
      price: "2000",
      name: "Chiku Khadi Art Silk Saree",
      discount: "20",
      actualPrice: "2500",
    },
    {
      img: "https://framerusercontent.com/images/Fr6Vb2Bkg2Sas1x3WyJit1X8ixE.jpg",
      price: "1600",
      name: "Pink Khadi Art Silk Saree",
      discount: "20",
      actualPrice: "2000",
    },
    {
      img: "https://framerusercontent.com/images/Dn2hBdEL86EDEvATmiYmOuXguY.jpg",
      price: "1200",
      name: "Dark Purple Mysore Silk Saree",
      discount: "20",
      actualPrice: "1500",
    },
    {
      img: "https://framerusercontent.com/images/DKUAgaR1NNRvbRP5qzATSwPPbc.jpg",
      price: "1600",
      name: "Green & Purple Pochampalli Silk Saree",
      discount: "20",
      actualPrice: "2000",
    },
    {
      img: "https://framerusercontent.com/images/Ji1Tq0FNqXyLQJOCZw9kgzRpR4.png",
      price: "3000",
      name: "Red Banarasi Silk Saree",
      discount: "25",
      actualPrice: "4000",
    },
    {
      img: "https://framerusercontent.com/images/tWKMGoRtLHSLshTSDTFvy8kb24.png",
      price: "2200",
      name: "Blue Cotton Silk Saree",
      discount: "15",
      actualPrice: "2600",
    },
    {
      img: "https://framerusercontent.com/images/gkVpU4bpMqOeoQhIKUMHCReH7qk.png",
      price: "1800",
      name: "Yellow Georgette Saree",
      discount: "30",
      actualPrice: "2600",
    },
    {
      img: "https://framerusercontent.com/images/8fwTncuBYaX8duI9rqZM9Y7IE.png",
      price: "2800",
      name: "Orange Patola Silk Saree",
      discount: "10",
      actualPrice: "3100",
    },
    {
      img: "https://framerusercontent.com/images/gRDOSxiqX2M6P7Dl3iPCNYhfrjk.png",
      price: "3500",
      name: "White Kanchipuram Silk Saree",
      discount: "20",
      actualPrice: "4400",
    },
    {
      img: "https://framerusercontent.com/images/O8McCVkRWTpwpPgP56Y0tqEVdc.jpg",
      price: "1500",
      name: "Black Chiffon Saree",
      discount: "35",
      actualPrice: "2300",
    },
  ];

  // Bind external buttons to Swiper + keep arrow visibility in sync
  useEffect(() => {
    if (!swiperReady) return;
    const swiper = swiperRef.current;
    if (!swiper || !prevRef.current || !nextRef.current) return;

    // Attach external buttons
    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;
    swiper.navigation.init();
    swiper.navigation.update();

    const refresh = () => {
      setAtStart(swiper.isBeginning);
      setAtEnd(swiper.isEnd);
      setLocked(swiper.isLocked); // true if no overflow (slides <= slidesPerView)
    };

    // Initial + on every change
    refresh();
    swiper.on("slideChange", refresh);
    swiper.on("resize", refresh);
    swiper.on("breakpoint", refresh);
    swiper.on("update", refresh);

    return () => {
      swiper.off("slideChange", refresh);
      swiper.off("resize", refresh);
      swiper.off("breakpoint", refresh);
      swiper.off("update", refresh);
    };
  }, [swiperReady]);

  const mobileView =  window.innerWidth < 800;

  return (
    <>
      <div className="w-full mx-auto py-3 md:py-4 md:px-6 lg:px-8 bg-black">
        <div className="w-[90%] mx-auto flex flex-col justify-center items-center text-white md:mb-8 relative py-3">
          <h1 className="text-[40px] md:text-[65px] py-3 font-heading font-[950] capitalized leading-14 z-20">
            Trending Now
          </h1>
          <video
            src={assets.trending}
            loop
            autoPlay
            muted
            playsInline
            preload="auto"
            className="absolute h-[100px] w-[500px] object-cover"
          />
        </div>

        <div className="w-[95%] h-auto md:w-[90%] lg:w-full mx-auto relative overflow-visible py-6 lg:py-4">
          <Swiper
            modules={[Navigation]}
            className=" w-[90%] lg-[95%] py-10 md:py-16 lg:gap-5"
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setSwiperReady(true);
            }}
            spaceBetween={5}
            speed={600}
            slidesPerView={3}
            slidesPerGroup={mobileView ? 3 : 5} // 1 click = 4 slides
            allowTouchMove={true} // swipe off
            loop={false}
            watchOverflow={true} // lock when no overflow
            breakpoints={{
              460: { slidesPerView: 3, spaceBetween: 5 },
              640: { slidesPerView: 3, spaceBetween: 5 },
              768: { slidesPerView: 3, spaceBetween: 5 },
              1024: { slidesPerView: 5, spaceBetween: 45 },
              1440: { slidesPerView: 5, spaceBetween: 45 },
            }}
          >
            {products.map((item, index) => (
              <SwiperSlide
                key={index}
                className="flex justify-center items-start h-auto"
              >
                <Link to={"/product/:id"} className="w-full">
                  <div className="max-w-[100px] md:max-w-[180px] lg:max-w-[250px] mx-auto flex flex-col gap-2 cursor-pointer group pt-2 pb-5">
                    <div className="relative overflow-hidden rounded-[12px]">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-[150px] md:h-[280px] lg:h-[360px] object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    <div className="w-full flex flex-col md:flex-row justify-between items-start text-white gap-2">
                      <div className="w-full flex flex-col  items-start gap-1 lg:gap-2">
                        <h1 className="w-full lg:w-[90%] text-[10px] md:text-[14px] lg:text-[17px] font-body capitalize font-medium md:leading-4.5 leading-3 lg:leading-5.5">
                          {item.name}
                        </h1>
                        <p className="w-full font-body flex justify-between text-[10px] md:text-[14px] lg:text-[15px] leading-none">
                          ₹{item.price}
                          <span className="px-2 block md:hidden lg:py-1 lg:border-2 border-white text-[10px] md:text-[14px] lg:text-[15px] font-body">
                             {item.discount}%
                          </span>
                        </p>
                      </div>
                      <div className=" hidden md:flex flex-row md:flex-col justify-between md:justify-center md:items-end gap-1 lg:gap-2">
                        <p className="lg:px-2 p-1 lg:py-1 border-2 border-white text-[12px] lg:text-[15px] font-body order-2 md:order-1">
                          {item.discount}%
                        </p>
                        <p className="text-gray-500 line-through font-body text-[12px] lg:text-[15px] order-1 md:order-2">
                          ₹{item.actualPrice}
                        </p>
                      </div>
                    </div>
                    <div className="hidden md:flex justify-start">
                      <p className="text-white/65 tracking-wide font-body capitalize text-[8px] lg:text-[10px] leading-0">
                        {index + 2} styling Available
                      </p>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* External arrows (outside) */}
          <button
            ref={prevRef}
            aria-label="Previous"
            aria-disabled={atStart || locked}
            className={`absolute top-1/2 -translate-y-1/2 -left-[15px] md:-left-[20px] lg:-left-[5px] z-20 p-3 rounded-full transition-all 
            ${
              atStart || locked
                ? "opacity-0 invisible pointer-events-none scale-95"
                : "opacity-100 visible pointer-events-auto scale-100"
            }
             text-white lg:hover:bg-white/30 focus:outline-none focus:ring-0`}
          >
            <svg
              className="w-4 h-4 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            ref={nextRef}
            aria-label="Next"
            aria-disabled={atEnd || locked}
            className={`absolute top-1/2 -translate-y-1/2 -right-[15px] md:-right-[20px] lg:-right-[5px] z-20 p-3 rounded-full transition-all 
            ${
              atEnd || locked
                ? "opacity-0 invisible pointer-events-none scale-95"
                : "opacity-100 visible pointer-events-auto scale-100"
            }
             text-white lg:hover:bg-white/30 focus:outline-none focus:ring-0`}
          >
            <svg
              className="w-4 h-4 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default Trending;
