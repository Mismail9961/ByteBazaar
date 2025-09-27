import React from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const DealCard = ({ product }) => {
  const { currency, router } = useAppContext();

  const discountPercent = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.offerPrice) / product.originalPrice) *
          100
      )
    : null;

  return (
    <div
      onClick={() => {
        router.push("/product/" + product._id);
        scrollTo(0, 0);
      }}
      className="relative flex flex-col bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer w-60 overflow-hidden"
    >
      {/* Discount Badge */}
      {discountPercent && (
        <span className="absolute top-3 left-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
          {discountPercent}% OFF
        </span>
      )}

      {/* Product Image */}
      <div className="flex items-center justify-center h-48 bg-gray-50 relative group">
        <Image
          src={product.image?.[0] || "/placeholder.png"}
          alt={product.name || "Product"}
          width={180}
          height={180}
          className="object-contain h-36 w-auto group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col space-y-2">
        {/* Name */}
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <p className="text-lg font-bold text-gray-900">
              {currency}
              {product.offerPrice}
            </p>
            {product.originalPrice && (
              <p className="text-sm text-gray-400 line-through">
                {currency}
                {product.originalPrice}
              </p>
            )}
          </div>
          {product.originalPrice && (
            <p className="text-xs text-green-600 font-medium">
              Save {currency}
              {product.originalPrice - product.offerPrice}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealCard;
