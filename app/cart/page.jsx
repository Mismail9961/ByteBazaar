'use client'
import React from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const { products, router, cartItems, addToCart, updateCartQuantity, getCartCount } =
    useAppContext();

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Your <span className="text-orange-600">Cart</span>
            </h2>
            <span className="text-lg md:text-xl text-gray-500/80">
              {getCartCount()} Items
            </span>
          </div>

          {/* Cart Items */}
          <div className="space-y-4">
            <AnimatePresence>
              {Object.keys(cartItems).map((itemId) => {
                const product = products.find((p) => p._id === itemId);
                if (!product || cartItems[itemId] <= 0) return null;

                return (
                  <motion.div
                    key={itemId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition p-4"
                  >
                    {/* Product Image */}
                    <div className="rounded-xl overflow-hidden bg-gray-50 p-2">
                      <Image
                        src={product.image[0]}
                        alt={product.name}
                        className="w-20 h-20 object-cover"
                        width={128}
                        height={128}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        ${product.offerPrice}
                      </p>
                      <button
                        className="text-xs text-orange-600 mt-1 hover:underline"
                        onClick={() => updateCartQuantity(product._id, 0)}
                      >
                        Remove
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateCartQuantity(product._id, cartItems[itemId] - 1)
                        }
                        className="p-2 rounded-md border border-gray-200 hover:bg-gray-100"
                      >
                        <Image
                          src={assets.decrease_arrow}
                          alt="decrease"
                          className="w-4 h-4"
                        />
                      </button>
                      <input
                        type="number"
                        value={cartItems[itemId]}
                        onChange={(e) =>
                          updateCartQuantity(product._id, Number(e.target.value))
                        }
                        className="w-12 text-center border rounded-md py-1"
                      />
                      <button
                        onClick={() => addToCart(product._id)}
                        className="p-2 rounded-md border border-gray-200 hover:bg-gray-100"
                      >
                        <Image
                          src={assets.increase_arrow}
                          alt="increase"
                          className="w-4 h-4"
                        />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-gray-800 font-medium text-right w-24">
                      ${(product.offerPrice * cartItems[itemId]).toFixed(2)}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Continue Shopping */}
          <button
            onClick={() => router.push("/all-products")}
            className="group flex items-center mt-8 gap-2 text-orange-600 font-medium hover:underline"
          >
            <Image
              className="group-hover:-translate-x-1 transition"
              src={assets.arrow_right_icon_colored}
              alt="continue"
            />
            Continue Shopping
          </button>
        </div>

        {/* Order Summary */}
        <OrderSummary />
      </div>
    </>
  );
};

export default Cart;
