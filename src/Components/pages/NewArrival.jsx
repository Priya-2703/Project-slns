"use client";
import React, { useEffect, useRef, useState } from "react";
import { assets } from "../../../public/assets/asset";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import UseFetchData from "../../Hooks/UseFetchData";

const NewArrival = () => {
  const BACKEND_URL = import.meta.env.VITE_API_URL;
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const { data } = UseFetchData();
  const [swiperReady, setSwiperReady] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [locked, setLocked] = useState(false);

  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder-image.png";
    if (imagePath.startsWith("http")) return imagePath;
    return `${BACKEND_URL}${imagePath}`;
  };

  // ✅ Filter only products with special_case === "new arrival"
  const arrivalProducts =
    data?.filter((product) => {
      const specialCase = product.special_case
        ?.toLowerCase()
        .trim()
        .replace(/[_\s-]/g, "");
      const match = specialCase === "newarrival";

      if (match) {
        console.log("✅ Found new arrival product:", product.product_name);
      }

      return match;
    }) || [];

  // Bind external buttons to Swiper + keep arrow visibility in sync
  useEffect(() => {
    if (!swiperReady) return;
    const swiper = swiperRef.current;
    if (!swiper || !prevRef.current || !nextRef.current) return;

    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;
    swiper.navigation.init();
    swiper.navigation.update();

    const refresh = () => {
      setAtStart(swiper.isBeginning);
      setAtEnd(swiper.isEnd);
      setLocked(swiper.isLocked);
    };

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

  const mobileView = window.innerWidth < 800;

  // Don't render if no trending products
  if (!arrivalProducts || arrivalProducts.length === 0) {
    return null;
  }

  return (
    <>
      <div className="w-full mx-auto py-3 md:py-4 md:px-6 lg:px-8 bg-black">
        <div className="w-[90%] mx-auto flex flex-col justify-center items-center text-white md:mb-8 relative py-3">
          <h1 className="text-[40px] md:text-[65px] py-3 font-heading font-[950] capitalized leading-14 z-20">
            New Arrival
          </h1>
          <video
            src={assets.arrival}
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
            className="w-[90%] lg-[95%] py-10 md:py-16 lg:gap-5"
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setSwiperReady(true);
            }}
            spaceBetween={5}
            speed={600}
            slidesPerView={3}
            slidesPerGroup={mobileView ? 3 : 5}
            allowTouchMove={true}
            loop={false}
            watchOverflow={true}
            breakpoints={{
              460: { slidesPerView: 3, spaceBetween: 5 },
              640: { slidesPerView: 3, spaceBetween: 5 },
              768: { slidesPerView: 3, spaceBetween: 5 },
              1024: { slidesPerView: 5, spaceBetween: 45 },
              1440: { slidesPerView: 5, spaceBetween: 45 },
            }}
          >
            {arrivalProducts.map((item, index) => {
              return (
                <SwiperSlide
                  key={item.product_id}
                  className="flex justify-center items-start h-auto"
                >
                  <Link to={`/product/${item.product_id}`} className="w-full">
                    <div className="max-w-[100px] md:max-w-[180px] lg:max-w-[250px] mx-auto flex flex-col gap-2 cursor-pointer group pt-2 pb-5">
                      <div className="relative overflow-hidden rounded-[12px]">
                        <img
                          src={getImageUrl(item.primary_image)}
                          alt={item.product_name}
                          loading="lazy"
                          className="w-full h-[150px] md:h-[280px] lg:h-[360px] object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>

                      <div className="w-full flex flex-col md:flex-row justify-between items-start text-white gap-2">
                        <div className="w-full flex flex-col items-start gap-1 lg:gap-2">
                          <h1 className="w-full lg:w-[90%] text-[10px] md:text-[14px] lg:text-[17px] font-body capitalize font-medium md:leading-4.5 leading-3 lg:leading-5.5 line-clamp-2">
                            {item.product_name}
                          </h1>
                          <p className="w-full font-body flex justify-between text-[10px] md:text-[14px] lg:text-[15px] leading-none">
                            ₹{parseInt(item.price)}
                            <span className="px-2 block md:hidden lg:py-1 lg:border-2 border-white text-[10px] md:text-[14px] lg:text-[15px] font-body">
                              {parseInt(item.discount)}%
                            </span>
                          </p>
                        </div>
                        <div className="hidden md:flex flex-row md:flex-col justify-between md:justify-center md:items-end gap-1 lg:gap-2">
                          <p className="lg:px-2 p-1 lg:py-1 border-2 border-white text-[12px] lg:text-[15px] font-body order-2 md:order-1">
                            {parseInt(item.discount)}%
                          </p>
                          <p className="text-gray-500 line-through font-body text-[12px] lg:text-[15px] order-1 md:order-2">
                            ₹{parseInt(item.actual_price)}
                          </p>
                        </div>
                      </div>
                      <div className="hidden md:flex justify-start">
                        <p className="text-white/65 tracking-wide font-body capitalize text-[8px] lg:text-[10px] leading-0">
                          {item.category_name || "New Arrival"}
                        </p>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Navigation Arrows */}
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

export default NewArrival;
