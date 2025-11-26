"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

const Cart = () => {
  const { 
    products, 
    cartItems, 
    addToCart, 
    updateCartQuantity, 
    getCartCount, 
    router,
    isLoadingCart 
  } = useAppContext();
  
  const { status } = useSession();

  // Show loading state
  if (status === "loading" || isLoadingCart) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4364EE] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cart...</p>
          </div>
        </div>
      </>
    );
  }

  // Show auth required
  if (status === "unauthenticated") {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Sign in to view your cart
            </h2>
            <button
              onClick={() => router.push("/signin")}
              className="px-6 py-3 bg-[#4364EE] text-white rounded-lg hover:bg-[#3451CC] transition"
            >
              Sign In
            </button>
          </div>
        </div>
      </>
    );
  }

  // Get cart items array
  const cartItemsArray = Object.keys(cartItems).filter(
    itemId => cartItems[itemId] > 0
  );

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-10 px-4 sm:px-6 md:px-16 lg:px-32 pt-14 mb-20">
        {/* Left: Cart Items */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Your <span className="text-[#4364EE]">Cart</span>
            </h2>
            <span className="text-sm sm:text-base md:text-lg text-gray-500/80">
              {getCartCount()} item(s)
            </span>
          </div>

          {cartItemsArray.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <button
                onClick={() => router.push("/all-products")}
                className="px-6 py-3 bg-[#4364EE] text-white rounded-lg hover:bg-[#3451CC] transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <AnimatePresence>
                  {cartItemsArray.map((itemId) => {
                    const product = products.find((p) => p._id === itemId);
                    if (!product) return null;

                    return (
                      <motion.div
                        key={itemId}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.25 }}
                        className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition p-4"
                      >
                        <div className="rounded-xl overflow-hidden bg-gray-50 p-2 flex-shrink-0 mx-auto sm:mx-0">
                          <Image
                            src={product.image[0]}
                            alt={product.name}
                            className="w-24 h-24 sm:w-20 sm:h-20 object-cover"
                            width={96}
                            height={96}
                          />
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                          <p className="font-semibold text-gray-800 text-base sm:text-lg">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            ${product.offerPrice}
                          </p>
                          <button
                            className="text-xs text-red-500 mt-2 hover:underline"
                            onClick={() => updateCartQuantity(product._id, 0)}
                          >
                            Remove
                          </button>
                        </div>

                        <div className="flex justify-center sm:justify-start items-center gap-2">
                          <button
                            onClick={() =>
                              updateCartQuantity(product._id, cartItems[itemId] - 1)
                            }
                            disabled={cartItems[itemId] <= 1}
                            className="p-2 rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Image 
                              src={assets.decrease_arrow} 
                              alt="decrease" 
                              width={16} 
                              height={16} 
                            />
                          </button>
                          <input
                            type="number"
                            value={cartItems[itemId]}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value) && value >= 0) {
                                updateCartQuantity(product._id, value);
                              }
                            }}
                            min="1"
                            className="w-12 text-center border rounded-md py-1 text-sm"
                          />
                          <button
                            onClick={() => addToCart(product._id)}
                            className="p-2 rounded-md border border-gray-200 hover:bg-gray-100"
                          >
                            <Image 
                              src={assets.increase_arrow} 
                              alt="increase" 
                              width={16} 
                              height={16} 
                            />
                          </button>
                        </div>

                        <div className="text-gray-800 font-medium text-right w-full sm:w-24 mt-3 sm:mt-0">
                          ${(product.offerPrice * cartItems[itemId]).toFixed(2)}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <button
                onClick={() => router.push("/all-products")}
                className="group flex items-center mt-8 gap-2 text-[#4364EE] font-medium hover:underline mx-auto sm:mx-0"
              >
                <Image
                  className="group-hover:-translate-x-1 transition"
                  src={assets.arrow_right_icon_colored}
                  alt="continue"
                  width={20}
                  height={20}
                />
                Continue Shopping
              </button>
            </>
          )}
        </div>

        {/* Right: Order Summary */}
        {cartItemsArray.length > 0 && (
          <div className="md:w-1/3 lg:w-1/4 sticky top-20 self-start">
            <OrderSummary accentColor="#4364EE" />
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;