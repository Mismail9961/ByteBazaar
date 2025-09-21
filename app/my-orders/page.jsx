"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import axios from "axios";

const MyOrders = () => {
  const { currency } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/order/list");
      console.log(res)
      if (res.data.success) {
        setOrders(res.data.orders);
      } else {
        console.error("Failed to fetch orders:", res.data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-16 py-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#4F46E5] mb-6">
          My Orders
        </h2>

        {loading ? (
          <Loading />
        ) : orders.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            You have no orders yet.
          </p>
        ) : (
          <div className="space-y-6 max-w-5xl mx-auto">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition hover:shadow-xl"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-[#4F46E5] text-white px-5 py-3">
                  <span className="text-xs sm:text-sm">
                    Order ID: <strong>{order._id}</strong>
                  </span>
                  <span className="text-xs sm:text-sm mt-2 sm:mt-0">
                    Date:{" "}
                    {order.date
                      ? new Date(order.date).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col gap-5 sm:flex-row sm:gap-6">
                  {/* Product Info */}
                  <div className="flex flex-1 items-start gap-3">
                    <Image
                      className="w-14 h-14 sm:w-16 sm:h-16 object-cover bg-gray-100 rounded-lg"
                      src={assets.box_icon}
                      alt="box_icon"
                    />
                    <div className="flex flex-col">
                      <h3 className="font-semibold text-gray-800 text-base sm:text-lg">
                        {order.items
                          ?.map(
                            (item) =>
                              `${item.product?.name || "Product"} x ${
                                item.quantity
                              }`
                          )
                          .join(", ")}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {order.items?.length || 0} item(s)
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="sm:w-1/3 text-sm text-gray-700">
                    <p className="font-semibold text-gray-900 mb-1">
                      Delivery Address
                    </p>
                    {order.address && Object.keys(order.address).length > 0 ? (
                      <div className="leading-relaxed text-xs sm:text-sm">
                        {order.address.fullName && (
                          <p className="font-medium">{order.address.fullName}</p>
                        )}
                        {order.address.phoneNumber && (
                          <p>{order.address.phoneNumber}</p>
                        )}
                        {(order.address.area || order.address.city) && (
                          <p>
                            {[order.address.area, order.address.city]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        )}
                        {(order.address.state || order.address.pinCode) && (
                          <p>
                            {[order.address.state, order.address.pinCode]
                              .filter(Boolean)
                              .join(" - ")}
                          </p>
                        )}
                        {!order.address.fullName && !order.address.phoneNumber && !order.address.area && !order.address.city && !order.address.state && !order.address.pinCode && (
                          <p className="text-xs text-gray-500 italic">
                            Address details incomplete
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 italic">
                        No delivery address found
                      </p>
                    )}
                  </div>

                  {/* Amount & Status */}
                  <div className="sm:w-1/4 flex flex-col justify-between items-end">
                    <p className="text-lg font-bold text-[#4F46E5]">
                      {currency}
                      {order.amount}
                    </p>
                    <span
                      className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;