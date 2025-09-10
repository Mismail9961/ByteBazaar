import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {
  const { products, router } = useAppContext();

  return (
    <section className="px-6 md:px-12 lg:px-20 py-14 bg-gradient-to-b">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Popular Products
        </h2>
        <button
          onClick={() => router.push("/all-products")}
          className="hidden md:inline-block px-6 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition-all"
        >
          View All
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.slice(0, 10).map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>

      {/* Mobile Button */}
      <div className="flex justify-center mt-10 md:hidden">
        <button
          onClick={() => router.push("/all-products")}
          className="px-10 py-2.5 text-sm font-medium border border-gray-400 text-gray-700 rounded-full hover:bg-gray-100 transition"
        >
          See More
        </button>
      </div>
    </section>
  );
};

export default HomeProducts;
