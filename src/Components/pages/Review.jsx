import React from "react";

const Review = () => {
  const review = [
    {
      rate: "★★★★ 4/5",
      review: "Amazing product and the delivery is fast good experience",
      name: "Samantha",
      box:"review-1"
    },
    {
      rate: "★★★★ 4/5",
      review: "Amazing product and the delivery is fast good experience",
      name: "Samantha",
      box:"review-2"
    },
    {
      rate: "★★★★ 4/5",
      review: "Amazing product and the delivery is fast good experience",
      name: "Samantha",
      box:"review-3"
    },
    {
      rate: "★★★★ 4/5",
      review: "Amazing product and the delivery is fast good experience",
      name: "Samantha",
      box:"review-4"
    },
  ];

  return (
    <>
      <div className="mx-auto py-16">
        <div className="flex flex-col justify-center items-center text-white mb-8">
          <h1 className="text-[42px] py-3 font1 font-[200] uppercase leading-14">
            CUSTOMERS FEEDBACK
          </h1>
          <p className="text-[16px] tracking-wide font2-medium uppercase py-4">
            OVER 10.000+ SATISFIED CUSTOMERS
          </p>
        </div>

        <div className="flex justify-center items-center review-wrapper gap-4">
          {review.map((item,index) => {
            return (
              <div key={index} className={`border-2 review ${item.box} border-white/5 w-[400px] px-5 py-4 rounded-[2px]`}>
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
