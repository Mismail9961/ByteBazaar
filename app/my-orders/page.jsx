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
      <div className="min-h-screen bg-gray-50 px-6 md:px-16 lg:px-32 py-10">
        <h2 className="text-3xl font-bold text-[#4F46E5] mb-8">My Orders</h2>

        {loading ? (
          <Loading />
        ) : orders.length === 0 ? (
          <p className="text-gray-500">You have no orders yet.</p>
        ) : (
          <div className="grid gap-6 max-w-5xl">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white shadow-md rounded-2xl border border-gray-200 overflow-hidden"
              >
                {/* Header */}
                <div className="flex justify-between items-center bg-[#4F46E5] text-white px-6 py-4">
                  <span className="text-sm">
                    Order ID: <strong>{order._id}</strong>
                  </span>
                  <span className="text-sm">
                    Date:{" "}
                    {order.date
                      ? new Date(order.date).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col md:flex-row gap-6">
                  {/* Product Section */}
                  <div className="flex-1 flex items-start gap-4">
                    <Image
                      className="w-16 h-16 object-cover bg-gray-100 rounded-lg"
                      src={assets.box_icon}
                      alt="box_icon"
                    />
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        {order.items
                          ?.map(
                            (item) =>
                              `${item.product?.name || "Product"} x ${
                                item.quantity
                              }`
                          )
                          .join(", ")}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {order.items?.length || 0} item(s)
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="md:w-1/3 text-sm text-gray-700">
                    <p className="font-semibold text-gray-900 mb-1">
                      Delivery Address
                    </p>
                    <p>
                      {order.address?.fullName}, {order.address?.street},{" "}
                      {order.address?.city}, {order.address?.state}{" "}
                      {order.address?.postalCode}, {order.address?.country}
                    </p>
                  </div>

                  {/* Amount & Status */}
                  <div className="text-right md:w-1/4 flex flex-col justify-between">
                    <p className="text-lg font-bold text-[#4F46E5]">
                      {currency}
                      {order.amount}
                    </p>
                    <p
                      className={`text-sm font-medium mt-2 ${
                        order.status === "Delivered"
                          ? "text-green-600"
                          : order.status === "Cancelled"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {order.status}
                    </p>
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
