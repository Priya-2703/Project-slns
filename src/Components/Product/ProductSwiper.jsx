"use client";
import React, { useEffect, useRef, useState } from "react";
import { assets } from "../../../public/assets/asset";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";

const ProductSwiper = ({ products = null }) => {
  const BACKEND_URL = import.meta.env.VITE_API_URL;
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const [swiperReady, setSwiperReady] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [locked, setLocked] = useState(false);

  // Use passed products or default
  const displayProducts = products;

  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder-image.png";
    if (imagePath.startsWith("http")) return imagePath;
    return `${BACKEND_URL}${imagePath}`;
  };

  // Calculate discount percentage
  const calculateDiscount = (price, actualPrice) => {
    if (!actualPrice || !price) return 0;
    return Math.round(((actualPrice - price) / actualPrice) * 100);
  };

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

  // Return null if no products
  if (!displayProducts || displayProducts.length === 0) {
    return null;
  }

  return (
    <>
      <div className="w-[95%] h-auto md:w-[90%] lg:w-full mx-auto relative overflow-visible py-6 lg:py-8">
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
          {displayProducts.map((item, index) => {
            // Handle both API products and default products
            const productId = item.product_id || index;
            const productName = item.product_name || item.name;
            const productPrice = item.price;
            const productActualPrice = item.actual_price || item.actualPrice;
            const productImage = item.primary_image || item.img;
            const productDiscount =
              item.discount ||
              calculateDiscount(productPrice, productActualPrice);

            return (
              <SwiperSlide
                key={productId}
                className="flex justify-center items-start h-auto"
              >
                <Link to={`/product/${productId}`} className="w-full">
                  <div className="max-w-[100px] md:max-w-[180px] lg:max-w-[250px] mx-auto flex flex-col gap-2 cursor-pointer group pt-2 pb-5">
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={getImageUrl(productImage)}
                        alt={productName}
                        loading="lazy"
                        className="w-full h-[150px] md:h-[280px] lg:h-[360px] object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    <div className="w-full flex flex-col md:flex-row justify-between items-start text-white gap-2">
                      <div className="w-full flex flex-col items-start gap-1 lg:gap-2">
                        <h1 className="w-full lg:w-[90%] text-[10px] md:text-[14px] lg:text-[17px] font-body capitalize font-medium md:leading-4.5 leading-3 lg:leading-5.5 line-clamp-2">
                          {productName}
                        </h1>
                        <p className="w-full font-body flex justify-between text-[10px] md:text-[14px] lg:text-[15px] leading-none">
                          ₹{productPrice}
                          <span className="px-2 block md:hidden lg:py-1 lg:border-2 border-white text-[10px] md:text-[14px] lg:text-[15px] font-body">
                            {productDiscount}%
                          </span>
                        </p>
                      </div>
                      <div className="hidden md:flex flex-row md:flex-col justify-between md:justify-center md:items-end gap-1 lg:gap-2">
                        <p className="lg:px-2 p-1 lg:py-1 border-2 border-white text-[12px] lg:text-[15px] font-body order-2 md:order-1">
                          {parseInt(productDiscount)}%
                        </p>
                        <p className="text-gray-500 line-through font-body text-[12px] lg:text-[15px] order-1 md:order-2">
                          ₹{parseInt(productActualPrice)}
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
            );
          })}
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
    </>
  );
};

export default ProductSwiper;
