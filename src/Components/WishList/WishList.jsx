import React, { useContext } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { WishlistContext } from "../../Context/UseWishListContext";
import { X } from "lucide-react";
import { CartContext } from "../../Context/UseCartContext";

const WishList = () => {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const {addToCart} = useContext(CartContext)

  return (
    <>
      <div className="min-h-screen bg-black text-white mt-4">
        <Link
          to={"/product"}
          aria-label="Go to product details"
          title="Go to Product"
          className="group absolute top-[150px] left-[100px] z-20 inline-flex items-center justify-center rounded-full border border-neutral-700 bg-black p-2 text-gray-300 hover:text-white hover:border-gray-500 focus:outline-none backdrop-blur"
        >
          {/* Package/Box icon (SVG) */}
          <FaArrowLeft className="transition-transform group-hover:-translate-y-0.5 text-white text-[18px]" />
        </Link>
        <div className="w-[80%] mx-auto flex justify-start items-center py-3 px-10">
          <h1 className="mb-8 text-[30px] font1 uppercase text-white">
            My Wishlist
          </h1>
        </div>

        {/* wishlist product */}
        <div className="w-[80%] flex justify-center items-center mx-auto px-8 py-2 pb-10">
          {wishlist.length === 0 ? (
            <div className="h-fit flex justify-center items-center p-8 text-center font2 text-[13px] text-neutral-400">
              Your wishlist is empty.
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-5 px-5">
              {wishlist.map((item, id) => (
                <Link
                  key={id}
                  to={`/product/${item.id}`}
                  className="w-[250px] h-[450px] flex flex-col gap-3 cursor-pointer group relative"
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // stop <Link> navigation
                      e.stopPropagation(); // stop event bubbling
                      removeFromWishlist(item.id);
                    }}
                    className="absolute top-3 right-3 z-40 rounded-[4px] w-8 h-8 cursor-pointer  bg-gray-800  flex justify-center items-center"
                  >
                    <X size={16} className="text-[13px] text-white" />
                  </button>
                  <div className="relative overflow-hidden rounded-[12px]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-[400px] object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Add to Cart Button */}
                    <div className="absolute bottom-[-50px] left-0 w-full flex justify-center transition-all duration-500 ease-out group-hover:bottom-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(item)
                        }}
                        className="px-5 py-2 font-['Poppins'] rounded-full bg-white text-black font-semibold text-[13px] tracking-wide hover:bg-[#bb5e00] hover:text-white transition-colors duration-300"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-start text-white">
                    <div className="flex flex-col justify-center items-start gap-2">
                      <h1 className="w-[90%] text-[14px] font2-bold capitalize leading-5">
                        {item.name}
                      </h1>
                      <p className="font2 text-[14px] leading-none">
                        ₹{item.price}
                      </p>
                    </div>
                    <div className="flex flex-col justify-center items-start gap-3">
                      <p className="px-2 py-1 border-2 border-white text-[14px] font2">
                        {item.discount}%
                      </p>
                      <p className="text-gray-500 line-through font2 text-[14px]">
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
