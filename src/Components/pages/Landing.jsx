import React from "react";
import { assets } from "../../../public/assets/asset";
import "./Landing.css";
import Trending from "./Trending";
import NewArrival from "./NewArrival";
import Review from "./Review";

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

  return (
    <>
      <div className="relative min-h-screen overflow-x-hidden">
        {/* 🔹 Fixed background video */}
        <div className="h-screen relative">
          <video
            src="https://framerusercontent.com/assets/qC6sPixgSS0GI7viRcrgOsxdwSQ.mp4"
            loop
            autoPlay
            muted
            playsInline
            preload="auto"
            className="fixed top-0 left-0 w-full h-full object-cover z-[-1]"
          />

          {/* 🔹 Top + Bottom Overlay (scrolls with content) */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-0 w-full h-[50vh] bg-gradient-to-b from-black to-transparent"></div>
            <div className="absolute bottom-0 w-full h-[100vh] bg-gradient-to-t from-black to-black/5"></div>
          </div>
        </div>
      </div>

      <div className="bg-black h-auto relative overflow-x-hidden">
        {/* next section */}
        <div className="w-full mx-auto flex justify-center items-center  py-12">
          <div className="flex flex-col justify-center items-center">
            <h1 className="uppercase tracking-wide text-[11px] font2 font-[200] text-white">
              WELCOME TO
            </h1>
            <img src={assets.logo} alt="logo" className="w-[200px]" />
          </div>
        </div>

        {/* scroll saree */}
        <div className="overflow-hidden grid grid-cols-1 py-4 bg-black">
          <div className="flex justify-center items-center gap-4 card-wrapper">
            {images.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`saree ${item.saree} flex flex-col justify-center items-center`}
                >
                  <img
                    src={item.img}
                    alt={item.saree}
                    className="object-cover w-[300px] h-[400px]"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Elevating Your Style */}
        <div className="w-[100%] mx-auto py-8">
          <div className="flex flex-col justify-center items-center text-white">
            <h1 className="text-[42px] py-3 font1 font-[200] uppercase leading-14">
              Elevating Your Style
            </h1>
            <p className="w-[40%] text-[12px] font2 tracking-wide font-[100] uppercase text-center">
              Discover the Perfect Blend of Comfort and Trend with Our Exclusive
              Collection. Explore Deals on Jeans, Sneakers, and More!
            </p>
          </div>
          <div className="w-[90%] h-full mx-auto grid grid-cols-3 py-6 mt-8 gap-4">
            <div className="grid grid-cols-1">
              <div className="flex flex-col gap-4">
                <div className="relative h-[500px] w-full card rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 border border-gray-700 justify-start overflow-hidden box1">
                  <h1 className="font2-bold text-center text-[30px] uppercase text-white leading-[40px] py-3">
                    Banarasi Silk Sarees
                  </h1>
                  <p className="font2 tracking-wide text-[12px] text-white/65 text-center py-4">
                    Traditionally, Banarasi sarees were woven exclusively for
                    royalty and aristocracy, and they remain a popular choice
                    for weddings, grand celebrations, and festive occasions.
                  </p>
                  <div className="absolute bottom-[-70px] flex justify-center w-[100%]">
                    <img
                      src={assets.box1}
                      alt="Banarasi saree"
                      className="w-52"
                    />
                  </div>
                </div>
                <div className="relative h-[300px] w-full card rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 border border-gray-700 justify-start overflow-hidden box2">
                  <h1 className="font2-bold text-center text-[30px] uppercase text-white leading-[40px] py-3">
                    Mysore silk sarees
                  </h1>
                  <div className="absolute bottom-[-120px] flex justify-center w-[100%]">
                    <img
                      src={assets.box2}
                      alt="Mysore saree"
                      className="w-52"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1">
              <div className="relative h-[814px] w-full card rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 border border-gray-700 justify-center overflow-hidden box3">
                <div className="absolute top-[-180px] left-[0px]">
                  <img
                    src={assets.box31}
                    alt="Kanchipuram saree"
                    className="w-[850px] box31"
                  />
                </div>
                <h1 className="font2-bold text-center text-[30px] uppercase text-white leading-[40px]">
                  Kanchipuram Silk sarees
                </h1>
                <p className="font2 text-[12px] tracking-wide text-white/65 text-center py-4">
                  Explore exclusive deals on our top products. The perfect
                  opportunity to enrich your wardrobe with trendy pieces at
                  affordable prices.
                </p>
                <div className="absolute bottom-[-180px] flex justify-center w-[100%]">
                  <img
                    src={assets.box32}
                    alt="Kanchipuram saree"
                    className="w-[340px] box32"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-col-1">
              <div className="flex flex-col gap-4">
                <div className="relative h-[300px] w-full card rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 border border-gray-700 justify-start overflow-hidden box4">
                  <h1 className="font2-bold text-center text-[30px] uppercase text-white leading-[40px] py-3">
                    Pochampally sarees
                  </h1>

                  <div className="absolute bottom-[-170px] right-0">
                    <img
                      src={assets.box4}
                      alt="Pochampally saree"
                      className="w-64"
                    />
                  </div>
                </div>

                <div className="relative h-[500px] w-full card rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 border border-gray-700 justify-start overflow-hidden box5">
                  <h1 className="font2-bold text-center text-[30px] uppercase text-white leading-[40px] pt-4">
                    Cotton sarees
                  </h1>
                  <p className="font2 tracking-wide text-[12px] text-white/65 text-center py-4">
                    Passion for fashion and comfort is reflected in every pair
                    of sneakers. Experience style and functionality in a single
                    step.
                  </p>
                  <div className="absolute bottom-[-180px] flex justify-center w-[100%]">
                    <img
                      src={assets.box5}
                      alt="Cotton saree"
                      className="w-96"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TRENDING NOW */}
        <Trending/>

        {/* NEW ARRIVALS*/}
        <NewArrival/> 

        {/* Review*/}
        <Review/> 


      </div>
    </>
  );
};

export default Landing;
