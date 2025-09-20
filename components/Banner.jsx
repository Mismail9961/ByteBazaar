import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Banner = () => {
  return (
    <section className="relative flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-[#E6E9F2] to-[#f8f9fb] my-10 md:my-16 rounded-2xl overflow-hidden shadow-md px-4 sm:px-6 md:px-10">
      {/* Left Product Image */}
      <div className="flex-1 flex justify-center md:justify-start md:pl-6 py-8 md:py-16">
        <Image
          className="w-36 sm:w-44 md:w-56 lg:w-64 object-contain hover:scale-105 transition duration-500"
          src={assets.jbl_soundbox_image}
          alt="jbl_soundbox_image"
        />
      </div>

      {/* Text Content */}
      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-3 md:space-y-4">
        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-900 leading-snug max-w-lg">
          Level Up Your <span className="text-[#5F65F0]">Gaming</span> Experience
        </h2>
        <p className="text-sm sm:text-base max-w-md font-medium text-gray-600">
          From immersive sound to precise controls — everything you need to win.
        </p>
        <button className="group flex items-center gap-2 px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 bg-[#5F65F0] hover:bg-[#4c52d1] rounded-full text-white text-sm sm:text-base font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300">
          Buy now
          <Image
            className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition"
            src={assets.arrow_icon_white}
            alt="arrow_icon_white"
          />
        </button>
      </div>

      {/* Right Controller Image */}
      <div className="flex-1 flex justify-center md:justify-end mt-6 md:mt-0">
        {/* Desktop / Tablet Image */}
        <Image
          className="hidden md:block w-56 lg:w-72 xl:w-80 object-contain hover:scale-105 transition duration-500"
          src={assets.md_controller_image}
          alt="md_controller_image"
        />
        {/* Mobile Image */}
        <Image
          className="md:hidden w-36 sm:w-44 object-contain"
          src={assets.sm_controller_image}
          alt="sm_controller_image"
        />
      </div>
    </section>
  );
};

export default Banner;
