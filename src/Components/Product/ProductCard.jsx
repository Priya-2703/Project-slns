import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({product}) => {
  return (
    <>
      <Link
      to={`/product/${product.id}`}
        className="w-[250px] min-h-[550px] flex flex-col gap-4 cursor-pointer group"
      >
        <div className="relative overflow-hidden rounded-[12px]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        <div className="flex justify-between items-start text-white">
          <div className="flex flex-col justify-center items-start gap-3">
            <h1 className="w-[90%] text-[18px] font2-bold capitalize leading-7">
              {product.name}
            </h1>
            <p className="font2 text-[16px] leading-none">₹{product.price}</p>
          </div>
          <div className="flex flex-col justify-center items-start gap-3">
            <p className="px-2 py-1 border-2 border-white text-[16px] font2">
              {product.discount}%
            </p>
            <p className="text-gray-500 line-through font2 text-[16px]">
              ₹{product.actualPrice}
            </p>
          </div>
        </div>
        <div className="flex justify-start">
          <p className="text-white/65 tracking-wide font2 capitalize text-[12px] leading-0">
            {product.id + 2} styling Available
          </p>
        </div>
      </Link>
    </>
  );
};

export default ProductCard;
