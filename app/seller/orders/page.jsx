"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";

const Orders = () => {
  const { currency } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerOrders = async () => {
    try {
      const res = await fetch("/api/order/admin-list");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
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

          <div className="max-w-4xl space-y-4">
            {orders.length === 0 ? (
              <p className="text-[#5C66F0] text-center py-10">No orders found</p>
            ) : (
              orders.map((order, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-5 justify-between p-5 border-2 border-[#5C66F0] rounded-lg"
                >
                  {/* Order items */}
                  <div className="flex-1 flex gap-5 max-w-80">
                    <Image
                      className="w-16 h-16 object-cover"
                      src={assets.box_icon}
                      alt="box_icon"
                    />
                    <p className="flex flex-col gap-1">
                      <span className="font-semibold text-[#5C66F0]">
                        {order.items
                          .map(
                            (item) =>
                              `${item.product?.name || "Product"} x ${
                                item.quantity
                              }`
                          )
                          .join(", ")}
                      </span>
                      <span className="text-[#5C66F0]">
                        Items: {order.items.length}
                      </span>
                    </p>
                  </div>

                  {/* Address */}
                  <div className="text-[#5C66F0]">
                    <p>
                      <span className="font-semibold">{order.address.fullName}</span>
                      <br />
                      <span>{order.address.area}</span>
                      <br />
                      <span>{`${order.address.city}, ${order.address.state}`}</span>
                      <br />
                      <span>{order.address.phoneNumber}</span>
                    </p>
                  </div>

                  {/* Amount */}
                  <p className="font-bold my-auto text-[#5C66F0]">
                    {currency}
                    {order.amount}
                  </p>

                  {/* Order Info */}
                  <div className="text-[#5C66F0] text-sm">
                    <p className="flex flex-col gap-1">
                      <span>
                        <span className="font-semibold">Method:</span> COD
                      </span>
                      <span>
                        <span className="font-semibold">Date:</span>{" "}
                        {new Date(order.date).toLocaleDateString()}
                      </span>
                      <span className="font-semibold">
                        Status: {order.status}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Orders;
