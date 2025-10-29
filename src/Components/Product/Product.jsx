import { Link } from "react-router-dom";
import UseFetchData from "../../Hooks/UseFetchData";
import ProductCard from "./ProductCard";


const Product = () => {

    const {data} = UseFetchData()

  return (
    <>
      <div className="w-full mx-auto py-10 mt-18">
        <div className="w-[90%] mx-auto mt-4">
          <div className="flex justify-start items-start">
            <p className="text-white text-[12px] tracking-wide font2">
              <Link to={"/"} className="text-white/80 hover:text-white">
                Home
              </Link>{" "}
              / Product
            </p>
          </div>
        </div>

        <div className="w-[95%] mx-auto grid-cols-1 mt-5 py-10">
          <div className="flex justify-center flex-wrap items-center gap-7">
            {data.map((item, id) => (
                <ProductCard key={id} product={item}/>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
