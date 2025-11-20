import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react"; // or any icon you like

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

    //responsive
  const mobileView = window.innerWidth < 480;

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-linear-to-br from-white/10 via-black/10 to-white/10 border border-white/20 text-white shadow-lg transition-all duration-300 hover:bg-accet hover:border-accet hover:text-white ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <ArrowUp size={mobileView? 16 : 20} />
    </button>
  );
};

export default BackToTopButton;
