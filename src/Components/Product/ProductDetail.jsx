import { useContext, useEffect, useState } from "react";
import { assets } from "../../../public/assets/asset";
import "./product.css";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdVerified,
} from "react-icons/md";
import ProductSwiper from "./ProductSwiper";
import { Link, useParams } from "react-router-dom";
import UseFetchData from "../../Hooks/UseFetchData";
import { FaArrowLeft } from "react-icons/fa";
import { CartContext } from "../../Context/UseCartContext";

const img = [`${assets.dhosti1}`, `${assets.dhosti2}`, `${assets.dhosti3}`];
const images = [
  {
    img: "https://framerusercontent.com/images/vPcvfK8IU12P4Vgp663O0iRQd6M.jpg",
    saree: "product-1",
  },
  {
    img: "https://framerusercontent.com/images/ccbbJXnnIDzInGCc1JFwzcE.jpg",
    saree: "product-2",
  },
  {
    img: "https://framerusercontent.com/images/Wvrz45r4Zj4B5KD8o12Ssn0jC3E.jpg",
    saree: "product-3",
  },
  {
    img: "https://framerusercontent.com/images/7HrtBqUFUzLsm7pp25KlmtayTrM.jpg",
    saree: "product-4",
  },
  {
    img: "https://framerusercontent.com/images/y0pIZkQ9R2JFDsr0ZcKyYB2FbPI.jpg",
    saree: "product-5",
  },
  {
    img: "https://framerusercontent.com/images/kmuIrwM7mas4h0unNvDA2hcJeng.jpg",
    saree: "product-6",
  },
  {
    img: "https://framerusercontent.com/images/Q0ih86EcQhWKKGCX5VU05ql9c.jpg",
    saree: "product-7",
  },
  {
    img: "https://framerusercontent.com/images/88o9uv2eF0dKK5oEmNHMECrVOqE.jpg",
    saree: "product-8",
  },
  {
    img: "https://framerusercontent.com/images/loLqOcRkx7RXtQdl11HzDqQMvTA.jpg",
    saree: "product-9",
  },
  {
    img: "https://framerusercontent.com/images/QhPI9HoY4jWY1elsLaRanKqE0.jpg",
    saree: "product-10",
  },
];

const ProductDetail = () => {
  const { data } = UseFetchData();
  const [product, setProduct] = useState({});
  const {cart,addToCart} = useContext(CartContext)
  const { id } = useParams();

  useEffect(() => {
    if (data && data.length > 0) {
      const productId = parseInt(id);
      const foundProduct = data.find((item) => item.id === productId);
      setProduct(foundProduct);
    }
  }, [data, id]);

  const [cur, setCur] = useState(0);
  const [openIndex, setOpenIndex] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleImageClick = (e) => {
    if (!isZoomed) {
      setIsZoomed(true);
    } else if (!isDragging) {
      setIsZoomed(false);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e) => {
    if (isZoomed) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && isZoomed) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const prev = () => setCur((cur) => (cur === 0 ? img.length - 1 : cur - 1));
  const next = () => setCur((cur) => (cur === img.length - 1 ? 0 : cur + 1));

  return (
    <>
      <div className="w-full bg-black mx-auto mt-16 py-20">
        <Link
          to={"/product"}
          aria-label="Go to product details"
          title="Go to Product"
          className="group absolute top-[150px] left-[50px] z-20 inline-flex items-center justify-center rounded-full border border-neutral-700 bg-black p-2 text-gray-300 hover:text-white hover:border-gray-500 focus:outline-none backdrop-blur"
        >
          {/* Package/Box icon (SVG) */}
          <FaArrowLeft className="transition-transform group-hover:-translate-y-0.5 text-white text-[18px]" />
        </Link>
        <div className="w-[85%] mx-auto grid grid-cols-2 gap-7">
          {/* image */}
          <div className="flex sticky top-[40px] justify-center items-start px-2">
            <div className="relative overflow-hidden w-[100%] h-[900px] flex rounded-4xl">
              {img.map((item, id) => (
                <img
                  key={id}
                  src={product.image}
                  alt="img"
                  className={`object-cover object-center min-w-full transition-all ease-out duration-500 ${
                    isZoomed ? "cursor-move" : "cursor-zoom-in"
                  }`}
                  style={{
                    transform: `translateX(-${cur * 100}%) scale(${
                      isZoomed ? 2 : 1
                    }) translate(${isZoomed ? position.x : 0}px, ${
                      isZoomed ? position.y : 0
                    }px)`,
                  }}
                  onClick={handleImageClick}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  draggable={false}
                />
              ))}

              {!isZoomed && (
                <>
                  <div className="absolute inset-0 flex justify-between items-center px-5">
                    <button
                      onClick={prev}
                      className="bg-black/80 p-2 rounded-full flex justify-center cursor-pointer items-center"
                    >
                      <MdKeyboardArrowLeft className="text-white text-[22px]" />
                    </button>
                    <button
                      onClick={next}
                      className="bg-black/80 p-2 rounded-full flex justify-center cursor-pointer items-center"
                    >
                      <MdKeyboardArrowRight className="text-white text-[22px]" />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2">
                    {img.map((s, index) => (
                      <div
                        key={index}
                        className={`w-1.5 h-1.5 bg-white rounded-full transition-all ${
                          cur === index ? "p-2" : "bg-opacity-50"
                        }`}
                      ></div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* content */}
          <div className="flex flex-col justify-start h-auto items-start px-20 py-3">
            <div className="flex justify-start items-start">
              <p className="text-white text-[12px] tracking-wide font2">
                {product.category}
              </p>
            </div>
            <div className="text-white mt-20">
              <h1 className="font1 text-[35px]">{product.name}</h1>
            </div>
            <div className="text-white mt-14">
              <h1 className="font2 border border-white tracking-wider p-2 text-[18px]">
                {product.stockStatus}
              </h1>
            </div>
            <div className="text-white my-5 border-t-[1px] border-t-white/10 border-b-[1px] border-b-white/10 flex justify-between items-center w-full py-5 px-1">
              <p className="font2 text-[28px]">₹{product.price}</p>
              <div className="flex justify-center items-center gap-3">
                <p className="font-['Poppins'] line-through text-white/30 text-[14px]">
                  ₹{product.actualPrice}
                </p>
                <p className="font-['Poppins']  text-[14px]">
                  {product.discount}%
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-white text-[12px] tracking-wide font2">
                Choose Other Versions
              </h1>
              <div className="flex items-center gap-2">
                <img
                  src={assets.dhosti1}
                  alt="img"
                  className="w-[50px] h-[50px] object-cover object-center"
                />
                <img
                  src={assets.dhosti1}
                  alt="img"
                  className="w-[50px] h-[50px] object-cover object-center"
                />
                <img
                  src={assets.dhosti1}
                  alt="img"
                  className="w-[50px] h-[50px] object-cover object-center"
                />
                <img
                  src={assets.dhosti1}
                  alt="img"
                  className="w-[50px] h-[50px] object-cover object-center"
                />
                <img
                  src={assets.dhosti1}
                  alt="img"
                  className="w-[50px] h-[50px] object-cover object-center"
                />
              </div>
            </div>
            <div className="flex items-center mt-7 gap-1">
              {product?.sizes?.map((size, id) => (
                <div
                  key={id}
                  className="bg-white uppercase rounded-[4px] min-w-[60px] px-2 py-1 flex justify-center items-center font2 text-black text-[16px] hover:bg-white/80 transition-all duration-200 cursor-pointer"
                >
                  {size}
                </div>
              ))}
            </div>

            <div className="flex w-full flex-col py-8 mt-5 gap-3">
              <button className="text-[16px] text-black px-3 py-4 font2-bold rounded-[8px] w-full bg-white">
                Purchase Now
              </button>
              <Link to={"/cart"}>
                <button onClick={()=>addToCart(product)} className="text-[16px] text-white px-3 py-4 font2-bold rounded-[8px] w-full bg-[#955E30]">
                  Add to Cart
                </button>
              </Link>
            </div>

            <div className="flex flex-col items-center px-2">
              <div className="w-full border-b-[1px] border-b-white/10 pb-1 mt-5">
                <button
                  type="button"
                  onClick={() => toggle(0)}
                  className="w-full flex justify-between items-center font2-bold text-[16px] text-white cursor-pointer select-none"
                  aria-expanded={openIndex === 0}
                >
                  Product Discription
                  <svg
                    className={`h-6 w-6 transition-transform duration-300 ${
                      openIndex === 0 ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div
                  id="product-menu"
                  className={`mt-3 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                    openIndex === 0 ? "opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="mt-2 pb-5">
                    <ul className="space-y-5 leading-normal text-[12px] font2 text-white">
                      {/* <li className="pl-2">Dhoti Border Design May Vary</li> */}
                      <li className="pl-2">{product.description}</li>
                      {product?.washCare?.map((item, id) => (
                        <li key={id} className="pl-2">
                          {item}
                        </li>
                      ))}

                      {/* <li className="pl-2">Wash separately.</li>
                      <li className="pl-2">Use white Colour detergents.</li>
                      <li className="pl-2">Gentle Wash.</li>
                      <li className="pl-2">Don't use fabric bluing agents.</li> */}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="w-full border-b-[1px] border-b-white/10 pb-1 mt-5">
                <button
                  type="button"
                  onClick={() => toggle(1)}
                  className="w-full flex justify-between items-center font2-bold text-[16px] text-white cursor-pointer select-none"
                  aria-expanded={openIndex === 1}
                >
                  Item Details
                  <svg
                    className={`h-6 w-6 transition-transform duration-300 ${
                      openIndex === 1 ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div
                  id="product-menu"
                  className={`mt-3 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                    openIndex === 1 ? "opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="mt-2 pb-5">
                    <ul className="space-y-5 leading-normal text-[12px] font2 text-white">
                      <li className="pl-2">
                        Material - {product?.details?.Material}
                      </li>
                      <li className="pl-2">
                        Colour - {product?.details?.Colour}
                      </li>
                      <li className="pl-2">
                        Pattern - {product?.details?.Pattern}
                      </li>
                      <li className="pl-2">
                        Occasion - {product?.details?.Occasion}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="w-full border-b-[1px] border-b-white/10 pb-1 mt-5 ">
                <button
                  type="button"
                  onClick={() => toggle(2)}
                  className="w-full flex justify-between items-center font2-bold text-[16px] text-white cursor-pointer select-none"
                  aria-expanded={openIndex === 2}
                >
                  Delivery and Return
                  <svg
                    className={`h-6 w-6 transition-transform duration-300 ${
                      openIndex === 2 ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div
                  id="product-menu"
                  className={`pl-4 mt-3 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                    openIndex === 2 ? " opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="mt-2">
                    <h3 className="font2-bold text-white text-[12px]">
                      Delivery:
                    </h3>

                    <ul className="list-disc list-inside space-y-1 text-[10px] leading-normal font2 text-gray-100">
                      <li className="pl-2">
                        Delivery is made by express courier, within 2-5 working
                        days from the confirmation of the order.
                      </li>
                      <li className="pl-2">
                        The delivery cost is 100 INR for orders under 500 INR
                        and free for orders over 500 INR.
                      </li>
                      <li className="pl-2">
                        You can choose to have your order delivered to an
                        address specified by you or to a pick-up point.
                      </li>
                      <li className="pl-2">
                        You will receive an email with the delivery confirmation
                        and a tracking code for the parcel.
                      </li>
                    </ul>
                  </div>
                  <div className="mt-2">
                    <h3 className="font2-bold text-white text-[12px]">
                      Return:
                    </h3>

                    <ul className="list-disc list-inside space-y-1 text-[10px] leading-normal font2 text-gray-100">
                      <li className="pl-2">
                        You can return the products within 14 days of receipt,
                        without giving any reason.
                      </li>
                      <li className="pl-2">
                        The cost of returning the products is borne by the
                        customer.
                      </li>
                      <li className="pl-2">
                        Products can be returned by express courier or to a
                        pick-up point.
                      </li>
                      <li className="pl-2">
                        Products must be returned in their original packaging,
                        with labels intact and with the documents received in
                        the parcel.
                      </li>
                      <li className="pl-2">
                        The refund of the value of the products will be made
                        within 14 days of receipt of the return.
                      </li>
                    </ul>
                  </div>
                  <div className="mt-2">
                    <h3 className="font2-bold text-white text-[12px]">
                      Exceptions to return:
                    </h3>

                    <ul className="list-disc list-inside space-y-1 text-[10px] leading-normal font2 text-gray-100">
                      <li className="pl-2">
                        Products that have been worn, damaged or modified cannot
                        be returned.
                      </li>
                      <li className="pl-2">
                        Products that have been made to order or personalized
                        cannot be returned.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* review */}
        <div className="w-[90%] mx-auto px-10 py-7 mt-5">
          <div className="flex justify-start items-center">
            <h1 className="text-white font1 text-[26px] uppercase">Reviews</h1>
          </div>
          <div className="flex flex-col items-start">
            <div className="flex items-start mt-4 py-3 gap-8">
              <div className="flex flex-col justify-start items-start">
                <p className="text-[20px] text-white font2 uppercase">
                  Keerthana
                </p>
                <p className="text-[16px] flex justify-center items-center gap-2 text-white">
                  Verified Buyer{" "}
                  <MdVerified className="text-white text-[18px]" />
                </p>
              </div>
              <div className="w-[100%] flex flex-col justify-start items-start gap-2">
                <p className="text-[24px] text-white font2 uppercase">★★★★</p>
                <p className="text-[18px] font2 flex justify-center items-center gap-2 text-white">
                  It Was Really good '' Amazing Product and the delivery is fast
                  good experience "
                </p>
                <div className="flex justify-start items-center gap-4">
                  <p className="text-white text-[15px] font-['Poppins'] border-b-[2px] px-4 border-b-white/20 py-1">
                    Poor
                  </p>
                  <p className="text-white text-[15px] font-['Poppins'] border-b-[2px] px-4 border-b-white/20 py-1">
                    Good
                  </p>
                  <p className="text-white text-[15px] font-['Poppins'] border-b-[2px] px-4 border-b-white py-1">
                    Awesome
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-start mt-4 py-3 gap-8">
              <div className="flex flex-col justify-start items-start">
                <p className="text-[20px] text-white font2 uppercase">
                  Keerthana
                </p>
                <p className="text-[16px] flex justify-center items-center gap-2 text-white">
                  Verified Buyer{" "}
                  <MdVerified className="text-white text-[18px]" />
                </p>
              </div>
              <div className="w-[100%] flex flex-col justify-start items-start gap-2">
                <p className="text-[24px] text-white font2 uppercase">★★★★</p>
                <p className="text-[18px] font2 flex justify-center items-center gap-2 text-white">
                  It Was Really good '' Amazing Product and the delivery is fast
                  good experience "
                </p>
                <div className="flex justify-start items-center gap-4">
                  <p className="text-white text-[15px] font-['Poppins'] border-b-[2px] px-4 border-b-white/20 py-1">
                    Poor
                  </p>
                  <p className="text-white text-[15px] font-['Poppins'] border-b-[2px] px-4 border-b-white/20 py-1">
                    Good
                  </p>
                  <p className="text-white text-[15px] font-['Poppins'] border-b-[2px] px-4 border-b-white py-1">
                    Awesome
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Link to={"/product/product-review"}>
            <button className="w-full py-2 bg-[#955E30] cursor-pointer text-[18px] text-white font2-bold mt-8 rounded-[5px]">
              Write a Review for this Product
            </button>
          </Link>
        </div>

        {/* The Wardrobe Hub */}
        <div className="w-full mx-auto mt-7 py-6">
          <div className="flex flex-col gap-2 justify-center items-center">
            <p className="text-[12px] text-white uppercase tracking-wide font2">
              We give you more
            </p>
            <h1 className="text-[44px] text-white uppercase tracking-wide font1">
              The Wardrobe Hub
            </h1>
          </div>

          <div className="overflow-hidden relative grid grid-cols-1 py-4 bg-black">
            <div className="flex justify-center items-center gap-4 productCard-wrapper">
              {images.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`sareeProduct ${item.saree} flex flex-col justify-center items-center`}
                  >
                    <img
                      src={item.img}
                      alt={item.saree}
                      className="object-cover w-[200px] h-[300px] object-center rounded-3xl"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Similar products */}
        <div className="w-full mx-auto mt-7 py-6">
          <div className="flex flex-col gap-2 justify-center items-center">
            <p className="text-[12px] text-white uppercase tracking-wide font2">
              RECOMMENDATIONS FOR YOU
            </p>
            <h1 className="text-[44px] text-white uppercase tracking-wide font1">
              Similar products
            </h1>
          </div>

          <div className="w-[95%] mx-auto py-8">
            <div className="w-[300px] flex flex-col gap-4 cursor-pointer group">
              <div className="relative overflow-hidden rounded-[12px]">
                <img
                  src={assets.dhosti1}
                  alt="img"
                  className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="flex justify-between items-start text-white">
                <div className="flex flex-col justify-center items-start gap-3">
                  <h1 className="w-[90%] text-[20px] font2-bold capitalize leading-7">
                    Men Matching Border Dhoti & Half Sleeves Shirt Set Maroon
                    C81
                  </h1>
                  <p className="font2 text-[16px] leading-none">₹1,200</p>
                </div>
                <div className="flex flex-col justify-center items-start gap-3">
                  <p className="px-2 py-1 border-2 border-white text-[16px] font2">
                    20%
                  </p>
                  <p className="text-gray-500 line-through font2 text-[16px]">
                    ₹1,500
                  </p>
                </div>
              </div>
              <div className="flex justify-start">
                <p className="text-white/65 tracking-wide font2 capitalize text-[12px] leading-0">
                  0 styling Available
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Curated Styles for Everyone */}
        <div className="w-full mx-auto mt-7 py-6">
          <div className="flex flex-col gap-2 justify-center items-center">
            <h1 className="text-[44px] text-white uppercase tracking-wide font1">
              Curated Styles for Everyone
            </h1>
          </div>
          <ProductSwiper />
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
