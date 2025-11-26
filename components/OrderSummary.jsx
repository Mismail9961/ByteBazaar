"use client";

import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

const OrderSummary = () => {
  const {
    currency,
    router,
    getCartCount,
    getCartAmount,
    user,
    setCartItems,
    cartItems,
  } = useAppContext();

  const { status } = useSession();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 🏠 Fetch user's saved addresses
  const fetchUserAddresses = async () => {
    if (status !== "authenticated") return;

    try {
      const res = await axios.get("/api/user/get-address");

      const data = res.data;

      if (data.success) {
        setUserAddresses(data.addresses);
        if (data.addresses.length === 0) {
          toast.error("No addresses found. Please add an address.");
        }
      } else {
        toast.error(data.message || "Failed to fetch addresses");
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error(error.response?.data?.message || "Failed to load addresses");
    }
  };

  // 🧭 Handle address selection
  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  // 🧾 Create order
  const createOrder = async () => {
    if (status !== "authenticated") {
      toast.error("Please sign in to place an order");
      return;
    }

    if (!selectedAddress?._id) {
      toast.error("Please select an address before placing an order");
      return;
    }

    const cartItemsArray = Object.entries(cartItems)
      .filter(([_, quantity]) => quantity > 0)
      .map(([product, quantity]) => ({ product, quantity }));

    if (cartItemsArray.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setIsLoading(true);

    try {
      console.log("📦 Creating order with address:", selectedAddress);

      const { data } = await axios.post("/api/order/create", {
        address: selectedAddress._id,
        items: cartItemsArray,
      });

      if (data.success) {
        toast.success(data.message || "Order placed successfully!");
        setCartItems({});
        router.push("/order-placed");
      } else {
        toast.error(data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("❌ Order creation error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserAddresses();
    }
  }, [status]);

  return (
    <div className="w-full md:w-96 bg-white p-5 rounded-2xl shadow-md">
      <h2 className="text-xl md:text-2xl font-semibold text-[#4364EE]">
        Order Summary
      </h2>
      <hr className="border-[#4364EE]/30 my-5" />

      <div className="space-y-6">
        {/* Address Dropdown */}
        <div>
          <label className="text-base font-medium uppercase text-[#4364EE] block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border border-[#4364EE]/40 rounded-md">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-[#4364EE] focus:outline-none flex justify-between items-center"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="truncate">
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Select Address"}
              </span>
              <svg
                className={`w-5 h-5 inline transition-transform duration-200 flex-shrink-0 ml-2 ${
                  isDropdownOpen ? "rotate-0" : "-rotate-90"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#4364EE"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border border-[#4364EE]/40 shadow-md mt-1 z-10 py-1.5 rounded-md max-h-60 overflow-y-auto">
                {userAddresses.length > 0 ? (
                  userAddresses.map((address) => (
                    <li
                      key={address._id}
                      className="px-4 py-2 hover:bg-[#4364EE]/10 cursor-pointer text-[#4364EE]"
                      onClick={() => handleAddressSelect(address)}
                    >
                      {address.fullName}, {address.area}, {address.city},{" "}
                      {address.state}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500 text-center">
                    No addresses found
                  </li>
                )}
                <li
                  onClick={() => {
                    setIsDropdownOpen(false);
                    router.push("/add-address");
                  }}
                  className="px-4 py-2 hover:bg-[#4364EE]/10 cursor-pointer text-center font-medium text-[#4364EE] border-t border-[#4364EE]/20"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        <hr className="border-[#4364EE]/30 my-5" />

        {/* Summary */}
        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-[#4364EE]">Items {getCartCount()}</p>
            <p className="text-[#4364EE]">
              {currency}
              {getCartAmount()}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-[#4364EE]">Shipping Fee</p>
            <p className="font-medium text-[#4364EE]">Free</p>
          </div>
          <div className="flex justify-between">
            <p className="text-[#4364EE]">Tax (2%)</p>
            <p className="font-medium text-[#4364EE]">
              {currency}
              {Math.floor(getCartAmount() * 0.02)}
            </p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-semibold border-t border-[#4364EE]/30 pt-3">
            <p className="text-[#4364EE]">Total</p>
            <p className="text-[#4364EE]">
              {currency}
              {getCartAmount() + Math.floor(getCartAmount() * 0.02)}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={createOrder}
        disabled={isLoading || !selectedAddress}
        className="w-full bg-[#4364EE] text-white py-3 mt-5 rounded-md shadow-md hover:bg-[#3650c9] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

export default OrderSummary;