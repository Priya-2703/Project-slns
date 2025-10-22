import React, { useContext } from "react";
import { FaArrowLeft, FaCartPlus, FaOpencart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { WishlistContext } from "../../Context/UseWishListContext";
import { X } from "lucide-react";
import { CartContext } from "../../Context/UseCartContext";
import { ToastContext } from "../../Context/UseToastContext";

const WishList = () => {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { cart,addToCart } = useContext(CartContext);

    const { showToast } = useContext(ToastContext);
  
    const isInCart = cart.some((item) => item.id === wishlist.id);
  
    const handleCart = () => {
      if (isInCart) {
        showToast("Item already added in Cart", "success");
      } else {
        showToast("Item added in Cart", "success");
      }
    };

    //responsive
  const mobileView = window.innerWidth < 480

  return (
    <>
      <div className="min-h-screen bg-black text-white mt-20 md:mt-32">
        <Link
          to={"/product"}
          aria-label="Go to product details"
          title="Go to Product"
          className="group absolute top-[90px] left-[20px] md:top-[146px] lg:top-[150px] md:left-[70px] lg:left-[100px] z-20 inline-flex items-center justify-center rounded-full border border-neutral-700 bg-black p-2 text-gray-300 hover:text-white hover:border-gray-500 focus:outline-none backdrop-blur"
        >
          {/* Package/Box icon (SVG) */}
          <FaArrowLeft className="transition-transform group-hover:-translate-y-0.5 text-white text-[12px] md:text-[18px]" />
        </Link>
        <div className="w-[90%] md:w-[80%] mx-auto flex justify-start items-center py-3 px-10">
          <h1 className="mb-8 text-[20px] md:text-[30px] font1 uppercase text-white">
            My Wishlist
          </h1>
        </div>

        {/* wishlist product */}
        <div className="w-[90%] lg:w-[80%] flex justify-center items-center mx-auto px-2 lg:px-8 py-2 pb-10">
          {wishlist.length === 0 ? (
            <div className="h-fit flex justify-center items-center p-8 text-center font2 text-[13px] text-neutral-400">
              Your wishlist is empty.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:px-5">
              {wishlist.map((item, id) => (
                <Link
                  key={id}
                  to={`/product/${item.id}`}
                  className="lg:w-[250px] w-[160px] min-h-[250px] md:w-[200px] md:min-h-[380px] lg:min-h-[550px] flex flex-col gap-2 md:gap-3 cursor-pointer group relative"
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // stop <Link> navigation
                      e.stopPropagation(); // stop event bubbling
                      removeFromWishlist(item.id);
                    }}
                    className="absolute top-2 right-2 lg:top-3 lg:right-3 z-40 rounded-[4px] lg:w-8 lg:h-8 w-6 h-6 cursor-pointer  bg-gray-800  flex justify-center items-center"
                  >
                    <X size={mobileView ? 12 : 16} className=" text-white" />
                  </button>
                  <div className="relative overflow-hidden rounded-[12px]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-[250px] md:h-[300px] lg:h-[400px] object-cover object-center group-hover:blur-[2px] transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Add to Cart Button */}
                    <div className="absolute w-full flex justify-center bottom-0 translate-y-full group-hover:bottom-1/2 group-hover:translate-y-1/2 transition-all duration-500 ease-out">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(item);
                          handleCart()
                        }}
                        className=" w-15 h-15 flex justify-center items-center font-['Poppins'] hover:drop-shadow-[0px_0px_10px] rounded-full bg-white  font-semibold text-[13px] tracking-wide text-[#955E30] hover:drop-shadow-[#bb5e00] hover:bg-[#bb5e00] hover:text-white transition-all duration-300"
                      >
                        <FaOpencart className="text-[30px]" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-start text-white">
                    <div className="flex flex-col justify-center items-start gap-2">
                      <h1 className="w-[90%] text-[12px] md:text-[14px] font2-bold capitalize md:leading-5">
                        {item.name}
                      </h1>
                      <p className="font2 text-[12px] md:text-[14px] leading-none">
                        ₹{item.price}
                      </p>
                    </div>
                    <div className="flex flex-col justify-center items-start gap-3">
                      <p className="px-2 py-1 border-2 border-white text-[12px] md:text-[14px] font2">
                        {item.discount}%
                      </p>
                      <p className="text-gray-500 line-through font2 text-[12px] md:text-[14px]">
                        ₹{item.actualPrice}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WishList;
