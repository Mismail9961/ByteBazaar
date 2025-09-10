import React from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const DealCard = ({ product }) => {
  const { currency, router } = useAppContext();

  const discountPercent = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.offerPrice) /
          product.originalPrice) *
          100
      )
    : null;

  return (
    <div
      onClick={() => {
        router.push("/product/" + product._id);
        scrollTo(0, 0);
      }}
      className="relative flex flex-col bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer w-56"
    >
      {/* Discount Badge */}
      {discountPercent && (
        <span className="absolute top-2 right-2 bg-[#5F65F0] text-white text-xs font-semibold px-2 py-1 rounded-md shadow-md">
          {discountPercent}% OFF
        </span>
      )}

      {/* Product Image */}
      <div className="flex items-center justify-center h-40 bg-gray-50 rounded-t-xl">
        <Image
          src={product.image?.[0] || "/placeholder.png"}
          alt={product.name || "Product"}
          width={160}
          height={160}
          className="object-contain h-32 w-auto"
        />
      </div>

      {/* Product Info */}
      <div className="p-3 flex flex-col space-y-1">
        {/* Name */}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <p className="text-base font-bold text-gray-900">
              {currency}{product.offerPrice}
            </p>
            {product.originalPrice && (
              <p className="text-sm text-gray-400 line-through">
                {currency}{product.originalPrice}
              </p>
            )}
          </div>
          {product.originalPrice && (
            <p className="text-xs text-green-600 font-medium">
              Save – {currency}{product.originalPrice - product.offerPrice}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealCard;
