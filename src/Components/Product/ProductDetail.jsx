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
import { FaArrowLeft } from "react-icons/fa";
import { CartContext } from "../../Context/UseCartContext";
import { ToastContext } from "../../Context/UseToastContext";

const staticImages = [
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
];

const ProductDetail = () => {
  const [product, setProduct] = useState({});
  const [productImages, setProductImages] = useState([]); // 🆕 Multiple images
  const [loading, setLoading] = useState(true);
  const { cart, addToCart } = useContext(CartContext);
  const { id } = useParams();
  const { showToast } = useContext(ToastContext);

  const isInCart = cart.some((item) => item.id === product.id);

  const handleCart = () => {
    if (isInCart) {
      showToast("Item already added in Cart", "success");
    } else {
      showToast("Item added in Cart", "success");
    }
  };

  // 🆕 Fetch product and its images from database
  useEffect(() => {
    fetchProductFromDatabase();
  }, [id]);

  const fetchProductFromDatabase = async () => {
    try {
      setLoading(true);
      
      // Fetch product details
      const productResponse = await fetch(`http://localhost:5000/api/products/${id}`);
      
      if (!productResponse.ok) {
        throw new Error('Product not found');
      }

      const productData = await productResponse.json();
      setProduct(productData.product);

      // Fetch product images
      const imagesResponse = await fetch(`http://localhost:5000/api/products/${id}/images`);
      
      if (imagesResponse.ok) {
        const imagesData = await imagesResponse.json();
        
        if (imagesData.images && imagesData.images.length > 0) {
          setProductImages(imagesData.images);
        } else {
          // If no images in database, use product's main image
          setProductImages([{
            image_url: productData.product.image_url,
            image_type: 'primary'
          }]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch product:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const prev = () => setCur((cur) => (cur === 0 ? productImages.length - 1 : cur - 1));
  const next = () => setCur((cur) => (cur === productImages.length - 1 ? 0 : cur + 1));

  if (loading) {
    return (
      <div className="w-full bg-black min-h-screen flex items-center justify-center mt-28">
        <div className="text-white text-2xl font2">Loading product...</div>
      </div>
    );
  }

  if (!product || !product.product_id) {
    return (
      <div className="w-full bg-black min-h-screen flex items-center justify-center mt-28">
        <div className="text-white text-2xl font2">Product not found</div>
      </div>
    );
  }

  const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-image.png'; // Fallback image
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If relative path, prepend backend URL
  if (imagePath.startsWith('/static/')) {
    return `http://localhost:5000${imagePath}`;
  }
  
  return imagePath;
};

  return (
    <>
      <div className="w-full bg-black mx-auto mt-28 py-20">
        <Link
          to={"/product"}
          aria-label="Go to product details"
          title="Go to Product"
          className="group absolute top-[150px] left-[50px] z-20 inline-flex items-center justify-center rounded-full border border-neutral-700 bg-black p-2 text-gray-300 hover:text-white hover:border-gray-500 focus:outline-none backdrop-blur"
        >
          <FaArrowLeft className="transition-transform group-hover:-translate-y-0.5 text-white text-[18px]" />
        </Link>
        
        <div className="w-[85%] mx-auto grid grid-cols-2 gap-7">
          {/* Image Gallery */}
          <div className="flex sticky top-[40px] justify-center items-start px-2">
            <div className="w-full">
              {/* Main Image Display */}
              <div className="relative overflow-hidden w-[100%] h-[900px] flex rounded-4xl mb-4">
                {productImages.map((imageObj, idx) => (
                  <img
                    key={idx}
                    src={imageObj.image_url}
                    alt={`${product.product_name} - ${imageObj.image_type}`}
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

                {!isZoomed && productImages.length > 1 && (
                  <>
                    <div className="absolute inset-0 flex justify-between items-center px-5">
                      <button
                        onClick={prev}
                        className="bg-black/80 p-2 rounded-full flex justify-center cursor-pointer items-center hover:bg-black/90 transition-colors"
                      >
                        <MdKeyboardArrowLeft className="text-white text-[22px]" />
                      </button>
                      <button
                        onClick={next}
                        className="bg-black/80 p-2 rounded-full flex justify-center cursor-pointer items-center hover:bg-black/90 transition-colors"
                      >
                        <MdKeyboardArrowRight className="text-white text-[22px]" />
                      </button>
                    </div>
                    
                    {/* Image Type Badge */}
                    <div className="absolute top-4 left-4 bg-[#955E30] text-white px-3 py-1 rounded-full text-xs font2">
                      {productImages[cur]?.image_type === 'primary' ? 'Base Image' : 'Detail Shot'}
                    </div>
                    
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2">
                      {productImages.map((img, index) => (
                        <div
                          key={index}
                          className={`w-1.5 h-1.5 bg-white rounded-full transition-all cursor-pointer ${
                            cur === index ? "p-2" : "bg-opacity-50"
                          }`}
                          onClick={() => setCur(index)}
                        ></div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery - 🆕 NEW */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {productImages.map((imageObj, index) => (
                    <div
                      key={index}
                      onClick={() => setCur(index)}
                      className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                        cur === index ? 'border-[#955E30]' : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <img
                        src={imageObj.image_url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-24 object-cover"
                      />
                      {imageObj.image_type === 'primary' && (
                        <div className="absolute top-1 left-1 bg-[#955E30] text-white text-[8px] px-1.5 py-0.5 rounded font2">
                          Base
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-start h-auto items-start px-20 py-3">
            <div className="flex justify-start items-start">
              <p className="text-white text-[12px] tracking-wide font2">
                {product.category_name || 'Uncategorized'}
              </p>
            </div>
            <div className="text-white mt-20">
              <h1 className="font1 text-[35px]">{product.product_name}</h1>
            </div>
            <div className="text-white mt-14">
              <h1 className="font2 border border-white tracking-wider p-2 text-[18px]">
                {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
              </h1>
            </div>
            <div className="text-white my-5 border-t-[1px] border-t-white/10 border-b-[1px] border-b-white/10 flex justify-between items-center w-full py-5 px-1">
              <p className="font2 text-[28px]">₹{product.price}</p>
              <div className="flex justify-center items-center gap-3">
                <p className="font-['Poppins'] line-through text-white/30 text-[14px]">
                  ₹{(product.price * 1.2).toFixed(2)}
                </p>
                <p className="font-['Poppins'] text-[14px]">20% OFF</p>
              </div>
            </div>

            {/* 🆕 Image Count Info */}
            <div className="flex items-center gap-2 mb-5">
              <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-white/60 text-[12px] font2">
                {productImages.length} {productImages.length === 1 ? 'image' : 'images'} available
              </p>
            </div>

            <div className="flex w-full flex-col py-8 mt-5 gap-3">
              <button className="text-[16px] text-black px-3 py-4 font2-bold rounded-[8px] w-full bg-white hover:bg-white/90 transition-colors">
                Purchase Now
              </button>
              <Link to={"/cart"}>
                <button
                  onClick={() => {
                    addToCart(product);
                    handleCart();
                  }}
                  className="text-[16px] text-white px-3 py-4 font2-bold rounded-[8px] w-full bg-[#955E30] hover:bg-[#955E30]/80 transition-colors"
                >
                  Add to Cart
                </button>
              </Link>
            </div>

            {/* Product Description */}
            <div className="flex flex-col items-center px-2 w-full">
              <div className="w-full border-b-[1px] border-b-white/10 pb-1 mt-5">
                <button
                  type="button"
                  onClick={() => toggle(0)}
                  className="w-full flex justify-between items-center font2-bold text-[16px] text-white cursor-pointer select-none"
                  aria-expanded={openIndex === 0}
                >
                  Product Description
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
                  className={`mt-3 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                    openIndex === 0 ? "opacity-100 max-h-96" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="mt-2 pb-5">
                    <p className="text-white text-[14px] font2 leading-relaxed">
                      {product.description || 'No description available'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Item Details */}
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
                  className={`mt-3 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                    openIndex === 1 ? "opacity-100 max-h-96" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="mt-2 pb-5">
                    <ul className="space-y-3 leading-normal text-[12px] font2 text-white">
                      <li className="pl-2 flex items-center gap-2">
                        <span className="text-white/60">Stock:</span>
                        <span>{product.stock_quantity} units available</span>
                      </li>
                      <li className="pl-2 flex items-center gap-2">
                        <span className="text-white/60">Category:</span>
                        <span>{product.category_name}</span>
                      </li>
                      <li className="pl-2 flex items-center gap-2">
                        <span className="text-white/60">Product ID:</span>
                        <span>#{product.product_id}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Delivery and Return - Keep existing */}
              <div className="w-full border-b-[1px] border-b-white/10 pb-1 mt-5">
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
                  className={`pl-4 mt-3 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                    openIndex === 2 ? "opacity-100 max-h-[500px]" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="mt-2 pb-5">
                    <h3 className="font2-bold text-white text-[12px] mb-2">Delivery:</h3>
                    <ul className="list-disc list-inside space-y-1 text-[10px] leading-normal font2 text-gray-100">
                      <li className="pl-2">Delivery within 2-5 working days</li>
                      <li className="pl-2">Free delivery on orders over ₹1000</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section - Keep existing */}
        {/* ... (your existing reviews code) ... */}

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
        </div>

        {/* Curated Styles */}
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