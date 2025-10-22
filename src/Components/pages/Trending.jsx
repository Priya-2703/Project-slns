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

  return (
    <>
      <div className="mx-auto py-3 md:py-8 px-14 bg-black">
        <div className="flex flex-col justify-center items-center text-white md:mb-8 relative py-3">
          <h1 className="text-[28px] md:text-[42px] py-3 font1 font-[700] lg:font-[200] uppercase leading-14 z-20">
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

        <div className="max-w-[1400px] mx-auto relative overflow-visible py-2 lg:py-10">
          <Swiper
            modules={[Navigation]}
            className="trending-swiper"
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setSwiperReady(true);
            }}
            spaceBetween={48}
            speed={600}
            slidesPerView={4}
            slidesPerGroup={1} // 1 click = 4 slides
            allowTouchMove={true} // swipe off
            loop={false}
            watchOverflow={true} // lock when no overflow
            breakpoints={{
              460: { slidesPerView: 1, spaceBetween: 20 },
              640: { slidesPerView: 2, spaceBetween: 30 },
              768: { slidesPerView: 2, spaceBetween: 40 },
              1024: { slidesPerView: 4, spaceBetween: 48 },
            }}
          >
            {products.map((item, index) => (
              <SwiperSlide key={index}>
                <Link to={"/product/:id"}>
                  <div className="w-[300px] flex flex-col gap-4 cursor-pointer group">
                    <div className="relative overflow-hidden rounded-[12px]">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    <div className="flex justify-between items-start text-white">
                      <div className="flex flex-col justify-center items-start gap-3">
                        <h1 className="w-[90%] text-[20px] font2-bold capitalize leading-7">
                          {item.name}
                        </h1>
                        <p className="font2 text-[16px] leading-none">
                          ₹{item.price}
                        </p>
                      </div>
                      <div className="flex flex-col justify-center items-start gap-3">
                        <p className="px-2 py-1 border-2 border-white text-[16px] font2">
                          {item.discount}%
                        </p>
                        <p className="text-gray-500 line-through font2 text-[16px]">
                          ₹{item.actualPrice}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <p className="text-white/65 tracking-wide font2 capitalize text-[12px] leading-0">
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
            className={`absolute top-1/2 -translate-y-1/2 -left-[50px] md:-left-[60px] z-20 p-3 rounded-full transition-all backdrop-blur-sm
            ${
              atStart || locked
                ? "opacity-0 invisible pointer-events-none scale-95"
                : "opacity-100 visible pointer-events-auto scale-100"
            }
             text-white hover:bg-white/30 focus:outline-none focus:ring-0`}
          >
            <svg
              className="w-6 h-6"
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
            className={`absolute top-1/2 -translate-y-1/2 -right-[50px] md:-right-[60px] z-20 p-3 rounded-full transition-all backdrop-blur-sm
            ${
              atEnd || locked
                ? "opacity-0 invisible pointer-events-none scale-95"
                : "opacity-100 visible pointer-events-auto scale-100"
            }
             text-white hover:bg-white/30 focus:outline-none focus:ring-0`}
          >
            <svg
              className="w-6 h-6"
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

      <style jsx>{`
        .trending-swiper {
          padding: 20px 0 50px 0;
        }
      `}</style>
    </>
  );
};

export default Trending;
