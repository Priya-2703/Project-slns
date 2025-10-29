import React, { useState, useRef } from "react";
import { assets } from "../../../public/assets/asset";
import "./Review.css";

const Review = () => {
  const [hearts, setHearts] = useState([]);
  const throttleRef = useRef(null);

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

  // Throttled heart creation for smooth performance
  const handleMouseMove = (e) => {
    if (throttleRef.current) return;

    throttleRef.current = setTimeout(() => {
      throttleRef.current = null;
    }, 70); // Create hearts every 70ms

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create 2 hearts with smooth random spread
    const newHearts = Array.from({ length: 2 }, (_, i) => ({
      id: Date.now() + Math.random(),
      x: x + (Math.random() - 0.5) * 20,
      y: y,
      delay: i * 0.05,
      size: Math.random() * 8 + 18,
      duration: 2 + Math.random() * 0.5, // Random duration for variety
      rotation: (Math.random() - 0.5) * 30, // Random rotation
      offsetX: (Math.random() - 0.5) * 40, // Horizontal drift
    }));

    setHearts((prev) => [...prev.slice(-15), ...newHearts]); // Keep max 15 hearts

    // Cleanup
    setTimeout(() => {
      setHearts((prev) => prev.filter((heart) => !newHearts.includes(heart)));
    }, 2500);
  };

  return (
    <>
      <div
        className="mx-auto py-3 md:py-7 lg:py-4 review-section relative overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* Flying Hearts */}
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="flying-heart"
            style={{
              left: `${heart.x}px`,
              top: `${heart.y}px`,
              animationDelay: `${heart.delay}s`,
              animationDuration: `${heart.duration}s`,
              fontSize: `${heart.size}px`,
              "--offset-x": `${heart.offsetX}px`,
              "--rotation": `${heart.rotation}deg`,
            }}
          >
            ❤️
          </div>
        ))}

        <div className="flex flex-col items-center text-white md:mb-8">
          <div className="relative w-[800px] h-[200px] overflow-hidden flex flex-col justify-center items-center">
            {/* Text on top */}
            <h1 className="text-[40px] md:text-[65px] md:py-3 font-heading font-black capitalized relative z-20 leading-14">
              customers Feedback
            </h1>
            <p className="text-[10px] md:text-[12px] tracking-wide font-medium font-body py-4 relative z-20">
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
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-black to-transparent z-10" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black to-transparent z-10" />
          </div>
        </div>

        <div className="flex justify-center items-center review-wrapper gap-4">
          {review.map((item, index) => {
            return (
              <div
                key={index}
                className={`border-2 review ${item.box} border-white/5 w-[300px] lg:w-[400px] px-5 py-4 rounded-[2px]`}
              >
                <div className="flex flex-col justify-center items-start gap-5">
                  <p className="text-white text-[12px]">{item.rate}</p>
                  <p className="font2 text-[12px] font-semibold tracking-wide text-white">
                    "{item.review}"
                  </p>
                  <p className="font2 text-[12px] font-normal tracking-wide text-white">
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