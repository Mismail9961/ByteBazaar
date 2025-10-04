import React from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";

const Banner = () => {
  return (
    <section className="relative flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-[#E6E9F2] to-[#f8f9fb] my-8 sm:my-10 md:my-16 rounded-2xl overflow-hidden shadow-md px-4 sm:px-8 md:px-12 lg:px-16">
      
      {/* Left Product Image */}
      <div className="w-full md:w-1/3 flex justify-center md:justify-start py-6 sm:py-10 md:py-16">
        <Image
          src={assets.jbl_soundbox_image}
          alt="jbl_soundbox_image"
          className="w-32 sm:w-40 md:w-52 lg:w-64 xl:w-72 object-contain hover:scale-105 transition-transform duration-500"
          priority
        />
      </div>

      {/* Text Content */}
      <div className="w-full md:w-1/3 flex flex-col items-center md:items-start text-center md:text-left space-y-3 sm:space-y-4 md:space-y-5">
        <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 leading-snug max-w-lg">
          Level Up Your{" "}
          <span className="text-[#5F65F0]">Gaming</span> Experience
        </h2>
        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 font-medium max-w-md">
          From immersive sound to precise controls — everything you need to win.
        </p>
        <button className="group flex items-center gap-2 px-5 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-2.5 md:py-3 bg-[#5F65F0] hover:bg-[#4c52d1] rounded-full text-white text-xs sm:text-sm md:text-base font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
          Buy now
          <Image
            src={assets.arrow_icon_white}
            alt="arrow_icon_white"
            className="w-3 sm:w-4 h-3 sm:h-4 group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>

      {/* Right Controller Image */}
      <div className="w-full md:w-1/3 flex justify-center md:justify-end mt-6 md:mt-0">
        {/* Desktop / Tablet */}
        <Image
          src={assets.md_controller_image}
          alt="md_controller_image"
          className="hidden md:block w-48 lg:w-64 xl:w-80 object-contain hover:scale-105 transition-transform duration-500"
          priority
        />
        {/* Mobile */}
        <Image
          src={assets.sm_controller_image}
          alt="sm_controller_image"
          className="md:hidden w-32 sm:w-40 object-contain"
          priority
        />
      </div>
    </section>
  );
};

export default Banner;
