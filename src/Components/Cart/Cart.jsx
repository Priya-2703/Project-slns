import React, { useContext, useMemo, useState } from "react";
import { FaArrowLeft, FaMinus, FaPlus } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { CartContext } from "../../Context/UseCartContext";

function Cart() {
  const {
    cart,
    totalPrice,
    totalItems,
    removeFromCart,
    updateCartItemQuantity,
  } = useContext(CartContext);

  // Math
  const currency = (n) =>
    n.toLocaleString("en-IN", { style: "currency", currency: "INR" });

  const subtotal = useMemo(
    () => cart.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [cart]
  );

  // Optional: basic delivery fee logic (edit/Remove if not needed)
  const shipping = subtotal > 1000 && subtotal < 7000 ? 0 : 100;

  return (
    <div className="min-h-screen bg-black text-white mt-2">
      <Link
        to={"/product"}
        aria-label="Go to product details"
        title="Go to Product"
        className="group absolute top-[150px] left-[100px] z-20 inline-flex items-center justify-center rounded-full border border-neutral-700 bg-black p-2 text-gray-300 hover:text-white hover:border-gray-500 focus:outline-none backdrop-blur"
      >
        {/* Package/Box icon (SVG) */}
        <FaArrowLeft className="transition-transform group-hover:-translate-y-0.5 text-white text-[18px]" />
      </Link>
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

              {cart.length === 0 ? (
                <div className="p-8 text-center font2 text-[13px] text-neutral-400">
                  Your cart is empty.
                </div>
              ) : (
                cart.map((it) => {
                  const line = it.quantity * it.price;
                  return (
                    <div
                      key={it.id}
                      className="w-[100%] grid grid-cols-12 items-center gap-10 px-5 py-4"
                    >
                      {/* Product */}

                      <div className=" col-span-6 flex items-center gap-4">
                        <Link
                          to={`/product/${it.id}`}
                          className="flex items-center gap-4"
                        >
                          <img
                            src={it.image}
                            alt={it.name}
                            className="h-14 w-14 rounded-lg object-cover ring-1 ring-neutral-800"
                          />
                          <div>
                            <p className="font-medium font2-medium text-white leading-5">
                              {it.name}
                            </p>
                            <p className="text-sm font2 text-neutral-400">
                              {it.category}
                            </p>
                          </div>
                        </Link>
                      </div>

                      {/* Qty */}
                      <div className="col-span-3 flex justify-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900 px-2 py-1">
                          <button
                            onClick={() => updateCartItemQuantity(it.id, -1)}
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
                            value={it.quantity}
                            readOnly
                            className="w-10 bg-transparent font2 text-center outline-none"
                          />
                          <button
                            onClick={() => updateCartItemQuantity(it.id, 1)}
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
                          onClick={() => removeFromCart(it.id)}
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
                  value={currency(cart.length ? shipping : 0)}
                />
                <div className="my-4 h-px bg-neutral-800" />
                <SummaryRow
                  label="Total"
                  value={currency(cart.length ? totalPrice : 0)}
                  bold
                  large
                />
              </div>
              <Link to={"/checkout"}>
                <button
                  disabled={cart.length === 0}
                  className="mt-5 w-full rounded-full cursor-pointer font2-bold bg-[#815a37] px-5 py-3 font-medium text-white hover:text-black hover:bg-[#8f673f] transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Checkout Now
                </button>
              </Link>
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
