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
      className="bg-white rounded-2xl border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Discount Tag */}
      {discountPercent && (
        <span className="absolute m-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {discountPercent}% OFF
        </span>
      )}

      {/* Image */}
      <div className="flex items-center justify-center bg-gray-50 p-4">
        <Image
          src={product.image?.[0] || "/placeholder.png"}
          alt={product.name || "Product"}
          width={160}
          height={160}
          className="object-contain w-32 sm:w-36 md:w-40 hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4 space-y-2">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2">
          <p className="text-base sm:text-lg font-bold text-gray-900">
            {currency}
            {product.offerPrice}
          </p>
          {product.originalPrice && (
            <p className="text-xs sm:text-sm text-gray-400 line-through">
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
  );
};

export default DealCard;
