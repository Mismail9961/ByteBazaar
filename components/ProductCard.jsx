import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const ProductCard = ({ product }) => {
  const { currency, router } = useAppContext();

  return (
    <div
      onClick={() => {
        router.push("/product/" + product._id);
        scrollTo(0, 0);
      }}
      className="group relative flex flex-col bg-white rounded-xl border border-gray-200 hover:border-[#5F65F0]/40 transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer overflow-hidden w-full max-w-sm"
    >
      {/* Product Image */}
      <div className="relative w-full aspect-[4/3] flex items-center justify-center bg-gray-50">
        <Image
          src={product.image?.[0] || "/placeholder.png"}
          alt={product.name || "Product"}
          width={600}
          height={400}
          className="object-contain w-3/4 h-3/4 transform transition-transform duration-500 group-hover:scale-105"
        />

        {/* Wishlist Button */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 transition"
        >
          <Image
            className="h-4 w-4"
            src={assets.heart_icon}
            alt="heart_icon"
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="flex flex-col p-3 sm:p-4 space-y-1">
        {/* Title */}
        <h3 className="text-gray-900 font-semibold text-sm sm:text-base line-clamp-1">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-xs sm:text-sm line-clamp-1 hidden sm:block">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs font-medium text-gray-600">4.5</span>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Image
                key={index}
                className="h-3 w-3"
                src={
                  index < Math.floor(4)
                    ? assets.star_icon
                    : assets.star_dull_icon
                }
                alt="star_icon"
              />
            ))}
          </div>
        </div>

        {/* Price + Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2">
          <p className="text-base sm:text-lg font-bold text-gray-900">
            {currency}
            {product.offerPrice}
          </p>
          <button
            onClick={(e) => e.stopPropagation()}
            className="px-4 py-1.5 bg-[#5F65F0] hover:bg-[#4c52d1] text-white text-xs sm:text-sm font-medium rounded-full shadow-sm hover:shadow-md transition w-full sm:w-auto"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Accent Border Glow */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[#5F65F0]/20 transition duration-500"></div>
    </div>
  );
};

export default ProductCard;
