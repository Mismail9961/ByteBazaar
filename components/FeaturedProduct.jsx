import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const products = [
  {
    id: 1,
    image: assets.girl_with_headphone_image,
    title: "Unparalleled Sound",
    description: "Experience crystal-clear audio with premium headphones.",
  },
  {
    id: 2,
    image: assets.girl_with_earphone_image,
    title: "Stay Connected",
    description: "Compact and stylish earphones for every occasion.",
  },
  {
    id: 3,
    image: assets.boy_with_laptop_image,
    title: "Power in Every Pixel",
    description: "Shop the latest laptops for work, gaming, and more.",
  },
];

const FeaturedProduct = () => {
  return (
    <section className="mt-20">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Featured <span className="text-indigo-600">Products</span>
        </h2>
        <div className="w-16 h-1 bg-indigo-600 rounded-full mt-3"></div>
        <p className="text-gray-500 mt-3 max-w-xl">
          Discover our handpicked selection of the latest and most popular
          electronics designed for your lifestyle.
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-14 md:px-16 px-6">
        {products.map(({ id, image, title, description }) => (
          <div
            key={id}
            className="relative group overflow-hidden rounded-xl shadow-md"
          >
            {/* Product Image */}
            <Image
              src={image}
              alt={title}
              className="w-full h-auto object-cover transform group-hover:scale-105 transition duration-500"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-500"></div>

            {/* Text + CTA */}
            <div className="absolute bottom-6 left-6 right-6 text-white translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition duration-500">
              <h3 className="font-semibold text-xl md:text-2xl">{title}</h3>
              <p className="text-sm md:text-base mt-1 mb-3 leading-5">
                {description}
              </p>
              <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2 rounded-full text-sm font-medium shadow-md">
                Buy now
                <Image
                  className="w-3 h-3"
                  src={assets.redirect_icon}
                  alt="Redirect Icon"
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProduct;
