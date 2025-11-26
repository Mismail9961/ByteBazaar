"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import axios from "axios";
import toast from "react-hot-toast";
import { MoreVertical } from "lucide-react";
import { useSession } from "next-auth/react";

const ProductList = () => {
  const { router } = useAppContext();
  const { data: session } = useSession();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerProduct = async () => {
    if (!session) return; // wait for session

    try {
      const { data } = await axios.get("/api/product/list");

      if (data.success) setProducts(data.products);
      else toast.error(data.message || "Failed to load products");
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerProduct();
  }, [session]);

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between bg-white">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-6 text-2xl font-semibold text-[#5C66F0]">
          Your Products
        </h2>

        <div className="flex flex-col items-center max-w-5xl w-full overflow-hidden rounded-2xl shadow-sm bg-white border border-[#5C66F0]/30">
          {loading ? (
            <div className="w-full p-10 text-center text-[#5C66F0]/70">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="w-full py-16 text-center text-[#5C66F0]/70 flex flex-col items-center">
              {assets.empty_box && (
                <Image
                  src={assets.empty_box}
                  alt="empty"
                  width={120}
                  height={120}
                  className="mb-4 opacity-70"
                />
              )}
              <p className="text-lg">No products added yet</p>
              <button
                onClick={() => router.push("/seller/add-product")}
                className="mt-4 px-6 py-2 bg-[#5C66F0] text-white rounded-lg hover:bg-[#4a52c8] transition"
              >
                Add Your First Product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="table-fixed w-full border-collapse">
                <thead className="bg-[#5C66F0]/10 text-[#5C66F0] text-sm uppercase tracking-wide sticky top-0">
                  <tr>
                    <th className="w-2/5 px-6 py-3 text-left">Product</th>
                    <th className="px-6 py-3 text-left">Category</th>
                    <th className="px-6 py-3 text-left">Price</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  {products.map((product, index) => (
                    <tr
                      key={product._id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-[#5C66F0]/5"
                      } hover:bg-[#5C66F0]/10 transition`}
                    >
                      {/* Product */}
                      <td className="px-6 py-4 flex items-center space-x-4">
                        <div className="bg-[#5C66F0]/10 rounded-lg overflow-hidden shadow-sm">
                          <Image
                            src={product.image && product.image[0] ? product.image[0] : "/default-image.png"}
                            alt={product.name || "product image"}
                            width={80}
                            height={80}
                            className="w-14 h-14 object-cover"
                          />
                        </div>
                        <span className="font-medium text-gray-900 truncate">
                          {product.name}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-xs font-medium bg-[#5C66F0]/10 text-[#5C66F0] rounded-full">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">
                          ${product.offerPrice || product.price}
                        </span>
                        {product.offerPrice && (
                          <span className="ml-2 text-xs line-through text-gray-400">
                            ${product.price}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => router.push(`/product/${product._id}`)}
                            className="px-3 py-1.5 text-sm bg-[#5C66F0] text-white rounded-lg hover:bg-[#4a52c8] transition"
                          >
                            View
                          </button>
                          <button className="p-2 rounded-lg hover:bg-[#5C66F0]/10">
                            <MoreVertical className="w-4 h-4 text-[#5C66F0]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductList;
