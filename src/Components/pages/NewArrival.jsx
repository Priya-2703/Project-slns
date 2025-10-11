import React from "react";
import { assets } from "../../../public/assets/asset";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const NewArrival = () => {
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
    // 6 more products add pannunga
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

  return (
    <>
      <div className="mx-auto py-8 px-6 bg-black">
        <div className="flex flex-col justify-center items-center text-white mb-8">
          <h1 className="text-[42px] py-3 font1 font-[200] uppercase leading-14">
            NEW ARRIVALS
          </h1>
        </div>

        {/* Swiper Container */}
        <div className="max-w-[1400px] mx-auto">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={48}
            slidesPerView={4}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              bulletClass: "swiper-pagination-bullet",
              bulletActiveClass: "swiper-pagination-bullet-active",
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={false}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 48,
              },
            }}
            className="trending-swiper"
          >
            {products.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-col gap-4 cursor-pointer group">
                  {/* Product Image */}
                  <div className="relative overflow-hidden rounded-[12px]">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Product Details */}
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
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="swiper-button-prev-custom absolute left-0 top-[200px] z-10 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all -translate-x-14">
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
          <button className="swiper-button-next-custom absolute right-0 top-[200px] z-10 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all translate-x-14">
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

      {/* Custom Styles */}
      <style jsx>{`
        .trending-swiper {
          padding: 20px 0 50px 0;
        }

        :global(.trending-swiper .swiper-pagination) {
          bottom: 0 !important;
        }

        :global(.trending-swiper .swiper-pagination-bullet) {
          background: white !important; /* Unga color code */
          opacity: 1;
          width: 10px;
          height: 10px;
        }

        :global(.trending-swiper .swiper-pagination-bullet-active) {
          background: #ff6b6b !important; /* Active bullet color */
          opacity: 1;
          width: 24px;
          border-radius: 4px;
        }

        :global(.trending-swiper .swiper-button-prev),
        :global(.trending-swiper .swiper-button-next) {
          color: white;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          transition: all 0.3s;
        }

        :global(.trending-swiper .swiper-button-prev:hover),
        :global(.trending-swiper .swiper-button-next:hover) {
          background: white;
        }

        :global(.trending-swiper .swiper-button-prev:after),
        :global(.trending-swiper .swiper-button-next:after) {
          font-size: 20px;
          font-weight: bold;
        }
      `}</style>
    </>
  );
};

export default NewArrival