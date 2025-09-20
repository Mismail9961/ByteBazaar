"use client";
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";

const Product = () => {
  const { id } = useParams();
  const { products, router, addToCart } = useAppContext();

  const [mainImage, setMainImage] = useState(null);
  const [productData, setProductData] = useState(null);

  const fetchProductData = async () => {
    const product = products.find((product) => product._id === id);
    setProductData(product);
  };

  useEffect(() => {
    fetchProductData();
  }, [id, products.length]);

  return productData ? (
    <>
      <Navbar />

      {/* MAIN CONTENT */}
      <div className="px-4 sm:px-6 md:px-16 lg:px-32 pt-14 space-y-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Product Images */}
          <div className="px-2 sm:px-6 lg:px-10">
            <div className="rounded-2xl overflow-hidden bg-gray-100 shadow-md mb-5">
              <Image
                src={mainImage || productData.image[0]}
                alt={productData.name}
                className="w-full max-h-[480px] object-contain transition-transform duration-500 hover:scale-105"
                width={1280}
                height={720}
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              {productData.image.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setMainImage(image)}
                  className={`cursor-pointer rounded-lg overflow-hidden border transition ${
                    mainImage === image
                      ? "border-[#5F65F0] ring-2 ring-[#5F65F0]/40"
                      : "border-gray-200 hover:border-[#5F65F0]/60"
                  }`}
                >
                  <Image
                    src={image}
                    alt="product-thumbnail"
                    className="w-full h-full object-contain"
                    width={300}
                    height={300}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {productData.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center gap-0.5">
                {[...Array(4)].map((_, i) => (
                  <Image
                    key={i}
                    className="h-4 w-4"
                    src={assets.star_icon}
                    alt="star_icon"
                  />
                ))}
                <Image
                  className="h-4 w-4"
                  src={assets.star_dull_icon}
                  alt="star_dull_icon"
                />
              </div>
              <p className="text-gray-600 text-sm">(4.5/5)</p>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-6 text-sm sm:text-base">
              {productData.description}
            </p>

            {/* Price */}
            <p className="text-2xl sm:text-3xl font-semibold text-gray-900">
              ${productData.offerPrice}
              <span className="text-sm sm:text-base font-normal text-gray-500 line-through ml-2 sm:ml-3">
                ${productData.price}
              </span>
            </p>

            {/* Specs */}
            <hr className="my-6 border-gray-200" />
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse w-full max-w-md text-sm">
                <tbody>
                  <tr>
                    <td className="py-2 text-gray-600 font-medium">Brand</td>
                    <td className="py-2 text-gray-700">Generic</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600 font-medium">Color</td>
                    <td className="py-2 text-gray-700">Multi</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600 font-medium">Category</td>
                    <td className="py-2 text-gray-700">{productData.category}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <button
                onClick={() => addToCart(productData._id)}
                className="flex-1 py-3.5 bg-gray-100 text-gray-800 font-medium rounded-full border hover:bg-gray-200 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => {
                  addToCart(productData._id);
                  router.push("/cart");
                }}
                className="flex-1 py-3.5 bg-[#5F65F0] text-white font-medium rounded-full shadow hover:bg-[#4c52d1] transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center mb-6">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
              Featured{" "}
              <span className="text-[#5F65F0] font-extrabold">Products</span>
            </p>
            <div className="w-20 sm:w-24 h-1 bg-[#5F65F0] mt-2 rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6 mt-6 pb-14 w-full">
            {products.slice(0, 5).map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
          <button className="px-6 sm:px-8 py-2 mb-16 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 transition">
            See More
          </button>
        </div>
      </div>

      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default Product;
