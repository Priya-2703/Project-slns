import React, { useState, useRef } from "react";
import { assets } from "../../../public/assets/asset";
import "./Review.css";
import { useTranslation } from "react-i18next";

const Review = () => {
    const {t} = useTranslation()
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
      <div className="mx-auto py-1 md:py-7 lg:py-4 review-section relative overflow-hidden">

        <div className="flex flex-col items-center text-white md:mb-4 lg:mb-8">
          <div className="relative w-[800px] h-[200px] overflow-hidden flex flex-col justify-center items-center">
            {/* Text on top */}
            <h1 className="text-[30px] md:text-[35px] lg:text-[48px] md:py-1 lg:py-3 font-heading font-black capitalized relative z-20 leading-14 text-center">
              {t("home.headings.customer_feedback")}
            </h1>
            <p className="text-[10px] md:text-[12px] tracking-wide font-medium font-body relative z-20">
             {t("home.headings.satisfied_customers")}
            </p>

          </div>
        </div>

        <div className="flex justify-center items-center review-wrapper gap-4">
          {review.map((item, index) => {
            return (
              <div
                key={index}
                className={`border-2 review ${item.box} border-white/5 w-[300px] lg:w-[400px] px-3 py-2 md:px-5 md:py-4 rounded-xs`}
              >
                <div className="flex flex-col justify-center items-start gap-3 md:gap-5">
                  <p className="text-white text-[12px]">{item.rate}</p>
                  <p className="font-body text-[12px] font-semibold tracking-wide text-white">
                    "{item.review}"
                  </p>
                  <p className="font-body text-[12px] font-normal tracking-wide text-white">
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