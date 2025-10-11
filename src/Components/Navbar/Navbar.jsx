import { CircleUserRound, Search, ShoppingCart } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import { assets } from "../../../public/assets/asset";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const [showCard, setShowCard] = useState(false);
  const cardRef = useRef(null);
  const signRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        cardRef.current &&
        !cardRef.current.contains(e.target) &&
        !signRef.current.contains(e.target)
      ) {
        setShowCard(false);
      }
    };

    document.addEventListener("mousemove", handleClickOutside);
    return () => document.removeEventListener("mousemove", handleClickOutside);
  }, []);

  return (
    <>
      <div className="fixed w-full top-0 mx-auto py-1 md:py-4 px-5 md:px-10 z-40">
        <div className="flex justify-between items-center md:px-6">
          <div className="">
            <img src={assets.logo} alt="logo" className="w-[70px] md:w-[80px]" />
          </div>

          <div className="flex justify-center items-center gap-8 md:gap-16">
            <span>
              <Search
                strokeWidth={1.5}
                size={20}
                color="#955E30"
                className="nav-item"
              />
            </span>
            <span>
              <ShoppingCart
                size={20}
                strokeWidth={1.5}
                color="#955E30"
                className="nav-item"
              />
            </span>
            <span
              ref={signRef}
              className="relative signin"
              onMouseEnter={() => setShowCard(true)}
              onClick={() => setShowCard(true)}
            >
              <CircleUserRound
                size={20}
                strokeWidth={1.5}
                color="#955E30"
                className="nav-item"
              />
              <div
                ref={cardRef}
                className={`absolute top-[30px] right-[-3px] w-[160px] glass-card py-2 px-2 rounded-[14px] transition-all duration-300 ${
                  showCard
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <div className="flex flex-col justify-center items-center gap-1">
                  <a
                    href="/"
                    className="w-full bg-black/50 px-5 py-1.5 rounded-[10px]"
                  >
                    <p className="text-white/60 flex justify-center items-center gap-2 text-[14px]">
                      <FaHeart className="text-white/60 text-[14px]" /> Wishlist
                    </p>
                  </a>
                  <a
                    href="/"
                    className="w-full bg-black/50 px-5 py-1.5 rounded-[10px]"
                  >
                    <p className="text-white/60 flex justify-center items-center gap-2 text-[14px]">
                      Sign In
                    </p>
                  </a>
                  <a
                    href="/"
                    className="w-full bg-black/50 px-5 py-1.5 rounded-[10px]"
                  >
                    <p className="text-white/60 flex justify-center items-center gap-2 text-[14px]">
                      <FaHeart className="text-white/60 text-[12px]" /> B 2 B{" "}
                    </p>
                  </a>
                  <span className="bg-white/50 w-full h-[1px] my-1"></span>
                  <a
                    href="/"
                    className="w-full bg-black/50 px-5 py-1.5 rounded-[10px]"
                  >
                    <p className="text-white/60 flex justify-center items-center gap-2 text-[14px]">
                      <FaCircleArrowLeft className="text-white/60 text-[15px]" />{" "}
                      Sign Out
                    </p>
                  </a>
                </div>
              </div>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
