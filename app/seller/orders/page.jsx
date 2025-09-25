"use client";
import React, { useEffect, useState } from "react";
import { assets, orderDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";

const Orders = () => {
  const { currency } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerOrders = async () => {
    setOrders(orderDummyData);
    setLoading(false);
  };

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm bg-white">
      {loading ? (
        <Loading />
      ) : (
        <div className="md:p-10 p-4 space-y-5">
          <h2 className="text-2xl font-bold text-[#5C66F0]">Orders</h2>

          <div className="max-w-4xl rounded-md divide-y divide-gray-200">
            {orders.map((order, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-5 justify-between p-5 bg-white shadow-sm rounded-lg hover:shadow-md transition"
              >
                {/* Order items */}
                <div className="flex-1 flex gap-5 max-w-80">
                  <Image
                    className="w-16 h-16 object-cover"
                    src={assets.box_icon}
                    alt="box_icon"
                  />
                  <p className="flex flex-col gap-2">
                    <span className="font-medium text-gray-900">
                      {order.items
                        .map(
                          (item) => `${item.product.name} x ${item.quantity}`
                        )
                        .join(", ")}
                    </span>
                    <span className="text-gray-600">
                      Items: {order.items.length}
                    </span>
                  </p>
                </div>

                {/* Address */}
                <div className="text-gray-700">
                  <p>
                    <span className="font-medium text-[#5C66F0]">
                      {order.address.fullName}
                    </span>
                    <br />
                    <span>{order.address.area}</span>
                    <br />
                    <span>{`${order.address.city}, ${order.address.state}`}</span>
                    <br />
                    <span>{order.address.phoneNumber}</span>
                  </p>
                </div>

                {/* Amount */}
                <p className="font-semibold my-auto text-[#5C66F0]">
                  {currency}
                  {order.amount}
                </p>

                {/* Order Info */}
                <div className="text-gray-700 text-sm">
                  <p className="flex flex-col gap-1">
                    <span>
                      <span className="font-medium">Method:</span> COD
                    </span>
                    <span>
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(order.date).toLocaleDateString()}
                    </span>
                    <span className="text-red-500 font-medium">
                      Payment: Pending
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Orders;
