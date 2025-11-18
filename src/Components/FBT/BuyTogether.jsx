import React from "react";
import { assets } from "../../../public/assets/asset";
import { Equal, Plus, ShoppingCart, Sparkles } from "lucide-react";

const BuyTogether = () => {
  const isMobile = window.innerWidth <= 800;
  return (
    <>
      <div className="w-full ld:w-[90%] mx-auto py-2 lg:pt-5 lg:pb-10">
        <div className="flex flex-col">
          {/* Header with animated gradient */}
          <div className="flex justify-center items-center py-4">
            <h1 className="text-[12px] md:text-[20px] font-body text-white uppercase font-light tracking-widest ">
              Frequently Bought Together
            </h1>
          </div>

          {/* Products Container */}
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-1 mt-4 lg:gap-6 justify-center">
            {/* Product Card 1 */}
            <div className="group relative">
              <div className="hover:scale-105 transition-all duration-500 hover:rotate-1">
                <div className="rounded-md md:rounded-xl lg:rounded-[30px] relative overflow-hidden shadow-2xl lg:border-b-[3px] lg:border-r-[3px] border-white/60">
                  <div className="relative w-[100px] h-[150px] md:w-[150px] md:h-[200px] lg:w-[250px] lg:h-[350px] bg-linear-to-br from-gray-50 to-gray-100">
                    <img
                      src={assets.dhosti1}
                      alt="product"
                      className="w-full h-full object-cover rounded-md md:rounded-xl lg:rounded-[30px] group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent rounded-md md:rounded-xl lg:rounded-[20px]"></div>

                    {/* Discount Badge */}
                    <div className="absolute top-2 lg:top-4 right-1 lg:right-4 bg-linear-to-r from-red-500 to-pink-500 text-white p-1 md:px-2 lg:px-3 lg:py-1 rounded-md md:rounded-full text-[5px] md:text-[7px] lg:text-[10px] lg:font-bold lg:shadow-lg animate-bounce">
                      20% OFF
                    </div>
                  </div>

                  <div className="p-1 md:p-2 lg:p-4 absolute bottom-0 w-full bg-linear-to-t from-black/50 to-transparent">
                    <p className="text-[6px] lg:text-[8px] text-white font-normal">
                      Men's Dhotis
                    </p>
                    <h3 className="font-bold text-[8px] md:text-[10px] lg:text-[12px] text-white line-clamp-1 lg:line-clamp-2 md:leading-4">
                      Men Matching Border Dhoti & Half Sleeves Shirt Set Blue
                    </h3>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-[10px] md:text-[12px] lg:text-[16px] font-extrabold bg-linear-to-r from-white to-white/50 bg-clip-text text-transparent">
                        ₹1,200
                      </div>
                      <button className="bg-linear-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-sm border border-white/10 text-white px-2 py-0.5 md:px-3 lg:px-4 lg:py-1 rounded-full text-[8px] md:text-[10px] lg:text-[13px] font-bold shadow-lg duration-200 transform hover:-translate-y-1">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Animated Plus Icon */}
            <div className=" rounded-full md:p-3 shadow-xl ">
              <Plus size={isMobile ? 10 : 32} color="white" strokeWidth={3} />
            </div>

            {/* Product Card 2 */}
            <div className="group relative">
              <div className="hover:scale-105 transition-all duration-500 hover:rotate-1">
                <div className="rounded-md md:rounded-xl lg:rounded-[30px] relative overflow-hidden shadow-2xl lg:border-b-[3px] lg:border-r-[3px] border-white/60">
                  <div className="relative w-[100px] h-[150px] md:w-[150px] md:h-[200px] lg:w-[250px] lg:h-[350px] bg-linear-to-br from-gray-50 to-gray-100">
                    <img
                      src={assets.dhosti1}
                      alt="product"
                      className="w-full h-full object-cover rounded-md md:rounded-xl lg:rounded-[30px] group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent rounded-md md:rounded-xl lg:rounded-[20px]"></div>

                    {/* Discount Badge */}
                    <div className="absolute top-2 lg:top-4 right-1 lg:right-4 bg-linear-to-r from-red-500 to-pink-500 text-white p-1 md:px-2 lg:px-3 lg:py-1 rounded-md md:rounded-full text-[5px] md:text-[7px] lg:text-[10px] lg:font-bold lg:shadow-lg animate-bounce">
                      20% OFF
                    </div>
                  </div>

                  <div className="p-1 md:p-2 lg:p-4 absolute bottom-0 w-full bg-linear-to-t from-black/50 to-transparent">
                    <p className="text-[6px] lg:text-[8px] text-white font-normal">
                      Men's Dhotis
                    </p>
                    <h3 className="font-bold text-[8px] md:text-[10px] lg:text-[12px] text-white line-clamp-1 lg:line-clamp-2 md:leading-4">
                      Men Matching Border Dhoti & Half Sleeves Shirt Set Blue
                    </h3>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-[10px] md:text-[12px] lg:text-[16px] font-extrabold bg-linear-to-r from-white to-white/50 bg-clip-text text-transparent">
                        ₹1,200
                      </div>
                      <button className="bg-linear-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-sm border border-white/10 text-white px-2 py-0.5 md:px-3 lg:px-4 lg:py-1 rounded-full text-[8px] md:text-[10px] lg:text-[13px] font-bold shadow-lg duration-200 transform hover:-translate-y-1">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Animated Plus Icon */}
            <div className=" rounded-full md:p-3 shadow-xl ">
              <Plus size={isMobile ? 10 : 32} color="white" strokeWidth={3} />
            </div>

            {/* Product Card 3 */}
            <div className="group relative">
              <div className="hover:scale-105 transition-all duration-500 hover:rotate-1">
                <div className="rounded-md md:rounded-xl lg:rounded-[30px] relative overflow-hidden shadow-2xl lg:border-b-[3px] lg:border-r-[3px] border-white/60">
                  <div className="relative w-[100px] h-[150px] md:w-[150px] md:h-[200px] lg:w-[250px] lg:h-[350px] bg-linear-to-br from-gray-50 to-gray-100">
                    <img
                      src={assets.dhosti1}
                      alt="product"
                      className="w-full h-full object-cover rounded-md md:rounded-xl lg:rounded-[30px] group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent rounded-md md:rounded-xl lg:rounded-[20px]"></div>

                    {/* Discount Badge */}
                    <div className="absolute top-2 lg:top-4 right-1 lg:right-4 bg-linear-to-r from-red-500 to-pink-500 text-white p-1 md:px-2 lg:px-3 lg:py-1 rounded-md md:rounded-full text-[5px] md:text-[7px] lg:text-[10px] lg:font-bold lg:shadow-lg animate-bounce">
                      20% OFF
                    </div>
                  </div>

                  <div className="p-1 md:p-2 lg:p-4 absolute bottom-0 w-full bg-linear-to-t from-black/50 to-transparent">
                    <p className="text-[6px] lg:text-[8px] text-white font-normal">
                      Men's Dhotis
                    </p>
                    <h3 className="font-bold text-[8px] md:text-[10px] lg:text-[12px] text-white line-clamp-1 lg:line-clamp-2 md:leading-4">
                      Men Matching Border Dhoti & Half Sleeves Shirt Set Blue
                    </h3>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-[10px] md:text-[12px] lg:text-[16px] font-extrabold bg-linear-to-r from-white to-white/50 bg-clip-text text-transparent">
                        ₹1,200
                      </div>
                      <button className="bg-linear-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-sm border border-white/10 text-white px-2 py-0.5 md:px-3 lg:px-4 lg:py-1 rounded-full text-[8px] md:text-[10px] lg:text-[13px] font-bold shadow-lg duration-200 transform hover:-translate-y-1">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Animated Equal Icon */}
            <div className="hidden lg:block p-3 rounded-full shadow-xl">
              <Equal size={32} color="white" strokeWidth={3} />
            </div>

            {/* Total Price Card */}
            <div className="hidden lg:block relative group">
              <div className="relative bg-linear-to-br from-white/0 via-white/10 to-white/0 backdrop-blur-sm border border-white/10 p-6 rounded-[20px] min-w-[200px] hover:scale-105 transition-all font-['Poppins'] duration-500">
                <div className="text-center space-y-3">
                  <p className="text-white/90 font-semibold text-sm uppercase tracking-wide">
                    Total Bundle Price
                  </p>
                  <div className="space-y-1">
                    <p className="text-white/60 line-through text-lg font-medium">
                      ₹3,600
                    </p>
                    <p className="text-white text-3xl font-extrabold drop-shadow-lg">
                      ₹3,000
                    </p>
                  </div>
                  <div className="bg-linear-to-br from-white/0 via-white/5 to-white/0 backdrop-blur-sm border border-white/10 text-white px-3 py-1 rounded-full text-xs font-bold inline-block">
                    Save ₹600
                  </div>
                  <button className="w-full mt-4 bg-white text-black px-3 py-3 rounded-xl font-bold hover:bg-green-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-2 group text-[12px]">
                    <ShoppingCart
                      size={16}
                      className="group-hover:scale-110 transition-transform"
                    />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Total Price Card */}
          <div className="block lg:hidden w-[90%] md:w-[80%] mx-auto relative group py-4">
            <div className="relative bg-linear-to-br from-white/0 via-white/10 to-white/0 backdrop-blur-sm border border-white/10 p-3 md:p-4 rounded-[15px] min-w-[200px] hover:scale-105 transition-all font-['Poppins'] duration-500">
              <div className="text-center md:space-y-1">
                <p className="text-white/90 font-semibold text-[10px] md:text-[12px] uppercase tracking-wide">
                  Total Bundle Price
                </p>
                <div className="space-y-1">
                  <p className="text-white/60 line-through text-[10px] md:text-[11px] font-medium">
                    ₹3,600
                  </p>
                  <p className="text-white text-[12px] md:text-[16px] font-bold md:font-extrabold drop-shadow-lg">
                    ₹3,000
                  </p>
                </div>
                <div className="bg-linear-to-br from-white/0 via-white/5 to-white/0 backdrop-blur-sm border border-white/10 text-white px-3 py-1 rounded-full text-[10px] md:text-xs font-bold inline-block mt-2 md:mt-0">
                  Save ₹600
                </div>
                <button className="w-full mt-2 bg-white text-black p-2 rounded-md font-bold hover:bg-green-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-2 group text-[10px]">
                  <ShoppingCart
                    size={isMobile ? 10 : 16}
                    className="group-hover:scale-110 transition-transform"
                  />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyTogether;
