"use client";

import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const OrderSummary = () => {
  const {
    currency,
    router,
    getCartCount,
    getCartAmount,
    getToken,
    user,
    setCartItems,
    cartItems,
  } = useAppContext();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);

  const fetchUserAddresses = async () => {
    try {
      const token = await getToken();

      if (!token) {
        toast.error("You must be logged in to fetch addresses");
        return;
      }

      const res = await axios.get("/api/user/get-address", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;

      if (data.success) {
        setUserAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        } else {
          toast.error("No addresses found");
        }
      } else {
        toast.error(data.message || "Failed to fetch addresses");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const createOrder = async () => {
    toast.success("Order placed successfully ✅");
  };

  useEffect(() => {
    if (user) {
      fetchUserAddresses();
    }
  }, [user]);

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
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Select Address"}
              </span>
              <svg
                className={`w-5 h-5 inline transition-transform duration-200 ${
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
              <ul className="absolute w-full bg-white border border-[#4364EE]/40 shadow-md mt-1 z-10 py-1.5 rounded-md">
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-[#4364EE]/10 cursor-pointer text-[#4364EE]"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city},{" "}
                    {address.state}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-[#4364EE]/10 cursor-pointer text-center font-medium text-[#4364EE]"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Promo Code */}
        <div>
          <label className="text-base font-medium uppercase text-[#4364EE] block mb-2">
            Promo Code
          </label>
          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
              className="flex-grow w-full outline-none p-2.5 text-[#4364EE] border border-[#4364EE]/40 rounded-md"
            />
            <button className="bg-[#4364EE] text-white px-9 py-2 rounded-md shadow-md hover:bg-[#3650c9] transition">
              Apply
            </button>
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
        className="w-full bg-[#4364EE] text-white py-3 mt-5 rounded-md shadow-md hover:bg-[#3650c9] transition"
      >
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;
