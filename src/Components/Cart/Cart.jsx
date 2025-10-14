// import React from 'react'
// import { Link } from 'react-router-dom'

// const Cart = () => {
//   return (
//     <>
//     <div className='w-full mx-auto bg-black mt-20'>
//         <div className='flex flex-col justify-center items-center h-screen gap-3'>
//                 <h1 className='text-[16px] text-white font-["Poppins"]'>
//                     Your Cart is Empty
//                 </h1>
//                 <Link to={"/"}>
//                   <p className='text-[16px] text-[#955E30] font-["Poppins"] hover:underline transition-all duration-200'>
//                       Continue Shopping
//                   </p>
//                 </Link>
//         </div>
//     </div>
//     </>
//   )
// }

// export default Cart

// Single self-contained Cart component
import React, { useMemo, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Cart() {
  // Demo data (replace with your API data)
  const [items, setItems] = useState([
    {
      id: "p-1",
      name: "Chiku Khadi Art Silk Saree",
      variant: "Kanchipuram Silk",
      price: 2000,
      qty: 2,
      image:
        "https://framerusercontent.com/images/Fr6Vb2Bkg2Sas1x3WyJit1X8ixE.jpg",
    },
    {
      id: "p-2",
      name: "Dark Purple Mysore Silk Saree",
      variant: "Mysore Saree",
      price: 1200,
      qty: 2,
      image:
        "https://framerusercontent.com/images/Dn2hBdEL86EDEvATmiYmOuXguY.jpg",
    },
    {
      id: "p-3",
      name: "Green & Purple Pochampalli Silk Saree",
      variant: "Pochampalli Saree",
      price: 1600,
      qty: 2,
      image:
        "https://framerusercontent.com/images/DKUAgaR1NNRvbRP5qzATSwPPbc.jpg",
    },
    {
      id: "p-3",
      name: "Green & Purple Pochampalli Silk Saree",
      variant: "Pochampalli Saree",
      price: 1600,
      qty: 2,
      image:
        "https://framerusercontent.com/images/DKUAgaR1NNRvbRP5qzATSwPPbc.jpg",
    },
    {
      id: "p-3",
      name: "Green & Purple Pochampalli Silk Saree",
      variant: "Pochampalli Saree",
      price: 1600,
      qty: 2,
      image:
        "https://framerusercontent.com/images/DKUAgaR1NNRvbRP5qzATSwPPbc.jpg",
    },
  ]);

  // Math
  const currency = (n) =>
    n.toLocaleString("en-IN", { style: "currency", currency: "INR" });

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.qty, 0),
    [items]
  );

  // Optional: basic delivery fee logic (edit/Remove if not needed)
  const shipping = subtotal > 500 && subtotal < 7000 ? 0 : 100;

  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);

  // Actions
  const inc = (id) =>
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: it.qty + 1 } : it))
    );

  const dec = (id) =>
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, qty: Math.max(1, it.qty - 1) } : it
      )
    );

  const setQty = (id, qty) =>
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, qty: Math.max(1, Math.floor(qty || 1)) } : it
      )
    );

  const removeItem = (id) =>
    setItems((prev) => prev.filter((it) => it.id !== id));

  const checkout = () => {
    if (items.length === 0) return;
    console.log("Checkout summary:", { items, subtotal, shipping, total });
    alert("Proceeding to checkout...");
  };

  return (
    <div className="min-h-screen bg-black text-white mt-20">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="mb-8 text-[30px] font1 uppercase text-white">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-neutral-800 bg-black/20">
              <div className="w-[100%] grid grid-cols-12 px-4  py-4 text-[12px] font2 uppercase text-neutral-400">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-2 text-center">Total</div>
                <div className="col-span-1 text-right">Action</div>
              </div>
              <div className="h-px bg-neutral-800" />

              {items.length === 0 ? (
                <div className="p-8 text-center font2 text-[13px] text-neutral-400">
                  Your cart is empty.
                </div>
              ) : (
                items.map((it) => {
                  const line = it.qty * it.price;
                  return (
                    <div
                      key={it.id}
                      className="w-[100%] grid grid-cols-12 items-center gap-10 px-5 py-4"
                    >
                      {/* Product */}

                      <div className=" col-span-6 flex items-center gap-4">
                        <Link to={"/product/:id"} className="flex items-center gap-4">
                          <img
                            src={it.image}
                            alt={it.name}
                            className="h-14 w-14 rounded-lg object-cover ring-1 ring-neutral-800"
                          />
                          <div>
                            <p className="font-medium font2-medium leading-5">
                              {it.name}
                            </p>
                            <p className="text-sm font2 text-neutral-400">
                              {it.variant}
                            </p>
                          </div>
                        </Link>
                      </div>

                      {/* Qty */}
                      <div className="col-span-3 flex justify-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900 px-2 py-1">
                          <button
                            onClick={() => dec(it.id)}
                            className="h-5 w-5 inline-flex items-center justify-center rounded-full hover:bg-neutral-800"
                            aria-label="Decrease"
                          >
                            <FaMinus />
                          </button>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            min={1}
                            value={it.qty}
                            onChange={(e) => {
                              const v = e.target.value.replace(/\D/g, ""); // only digits
                              setQty(it.id, Number(e.target.value));
                            }}
                            className="w-10 bg-transparent font2 text-center outline-none"
                          />
                          <button
                            onClick={() => inc(it.id)}
                            className="h-5 w-5 inline-flex items-center justify-center rounded-full hover:bg-neutral-800"
                            aria-label="Increase"
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>

                      {/* Line total */}
                      <div className="col-span-2 text-center font2-medium font-medium tabular-nums">
                        {currency(line)}
                      </div>

                      {/* Remove */}
                      <div className="col-span-1 flex justify-center items-center">
                        <button
                          onClick={() => removeItem(it.id)}
                          className="h-5 w-5 inline-flex items-center justify-center rounded-full hover:bg-neutral-800 text-neutral-300"
                          aria-label="Remove item"
                        >
                          <FaTrashCan />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Summary */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-neutral-800 bg-black/20 p-5">
              <h3 className="mb-3 text-lg font2 uppercase font-semibold">
                Order Summary
              </h3>
              <div className="my-5 h-px bg-neutral-800" />
              <div className="font2-bold text-[14px] flex flex-col gap-3">
                <SummaryRow label="Sub Total" value={currency(subtotal)} />
                <SummaryRow
                  label="Delivery fee"
                  value={currency(items.length ? shipping : 0)}
                />
                <div className="my-4 h-px bg-neutral-800" />
                <SummaryRow
                  label="Total"
                  value={currency(items.length ? total : 0)}
                  bold
                  large
                />
              </div>
              <button
                onClick={checkout}
                disabled={items.length === 0}
                className="mt-5 w-full rounded-full cursor-pointer font2-bold bg-[#815a37] px-5 py-3 font-medium text-white hover:text-black hover:bg-[#8f673f] transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Checkout Now
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* UI helpers */
function SummaryRow({ label, value, bold = false, large = false }) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={[
          "text-neutral-300",
          bold ? "font-semibold" : "",
          large ? "text-base" : "text-sm",
        ].join(" ")}
      >
        {label}
      </span>
      <span
        className={[
          "tabular-nums",
          bold ? "font-semibold" : "",
          large ? "text-base" : "text-sm",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}
export default Cart;
