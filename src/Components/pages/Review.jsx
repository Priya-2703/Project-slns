import React from "react";
import { assets } from "../../../public/assets/asset";

const Review = () => {
  const review = [
    {
      rate: "★★★★ 4/5",
      review: "Amazing product and the delivery is fast good experience",
      name: "Samantha",
      box: "review-1",
    },
    {
      rate: "★★★★ 4/5",
      review: "Amazing product and the delivery is fast good experience",
      name: "Samantha",
      box: "review-2",
    },
    {
      rate: "★★★★ 4/5",
      review: "Amazing product and the delivery is fast good experience",
      name: "Samantha",
      box: "review-3",
    },
    {
      rate: "★★★★ 4/5",
      review: "Amazing product and the delivery is fast good experience",
      name: "Samantha",
      box: "review-4",
    },
  ];

  return (
    <>
      <div className="mx-auto py-16">
        <div className="flex flex-col items-center text-white mb-8">
          <div className="relative w-[800px] h-[200px] overflow-hidden flex flex-col justify-center items-center">
            {/* Text on top */}
            <h1 className="text-[42px] py-3 font1 font-[200] uppercase relative z-20 leading-14">
              CUSTOMERS FEEDBACK
            </h1>
            <p className="text-[16px] tracking-wide font2-medium uppercase py-4 relative z-20">
              OVER 10.000+ SATISFIED CUSTOMERS
            </p>

            {/* Video as background */}
            <video
              src={assets.review}
              loop
              autoPlay
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover z-0"
            />

            {/* Feather overlays */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black to-transparent z-10" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black to-transparent z-10" />
          </div>
        </div>

        <div className="flex justify-center items-center review-wrapper gap-4">
          {review.map((item, index) => {
            return (
              <div
                key={index}
                className={`border-2 review ${item.box} border-white/5 w-[400px] px-5 py-4 rounded-[2px]`}
              >
                <div className="flex flex-col justify-center items-start gap-5">
                  <p className="text-white text-[12px]">{item.rate}</p>
                  <p className="font2 text-[12px] tracking-wide text-white">
                    "{item.review}"
                  </p>
                  <p className="font2 text-[12px] tracking-wide text-white">
                    {item.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Review;
