import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {
  const { products, router } = useAppContext();

  return (
    <section className="px-4 sm:px-6 md:px-12 lg:px-20 py-10 sm:py-14 bg-gradient-to-b">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          Popular Products
        </h2>
        <button
          onClick={() => router.push("/all-products")}
          className="hidden sm:inline-block px-6 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition-all"
        >
          View All
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {products.slice(0, 10).map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>

      {/* Mobile Button */}
      <div className="flex justify-center mt-8 sm:mt-10 sm:hidden">
        <button
          onClick={() => router.push("/all-products")}
          className="w-full max-w-xs px-8 py-2.5 text-sm font-medium border border-gray-400 text-gray-700 rounded-full hover:bg-gray-100 transition"
        >
          See More
        </button>
      </div>
    </section>
  );
};

export default HomeProducts;
