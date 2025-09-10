import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const HeaderSlider = () => {
  const sliderData = [
    {
      id: 1,
      title: "Experience Pure Sound - Your Perfect Headphones Awaits!",
      offer: "Limited Time Offer 30% Off",
      buttonText1: "Buy now",
      buttonText2: "Find more",
      imgSrc: assets.header_headphone_image,
    },
    {
      id: 2,
      title: "Next-Level Gaming Starts Here - Discover PlayStation 5 Today!",
      offer: "Hurry up only few lefts!",
      buttonText1: "Shop Now",
      buttonText2: "Explore Deals",
      imgSrc: assets.header_playstation_image,
    },
    {
      id: 3,
      title: "Power Meets Elegance - Apple MacBook Pro is Here for you!",
      offer: "Exclusive Deal 40% Off",
      buttonText1: "Order Now",
      buttonText2: "Learn More",
      imgSrc: assets.header_macbook_image,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slider wrapper */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            className="flex flex-col-reverse md:flex-row items-center justify-between bg-gradient-to-r from-indigo-50 via-white to-indigo-100 py-10 md:px-16 px-6 mt-6 rounded-2xl shadow-md min-w-full"
          >
            {/* Text content */}
            <div className="md:pl-8 mt-10 md:mt-0">
              <p className="md:text-base text-indigo-600 font-medium pb-2">
                {slide.offer}
              </p>
              <h1 className="max-w-xl md:text-[42px] md:leading-[52px] text-2xl font-bold text-gray-800">
                {slide.title}
              </h1>
              <div className="flex items-center mt-6 gap-4">
                <button className="md:px-10 px-7 md:py-3 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-full shadow-md font-medium">
                  {slide.buttonText1}
                </button>
                <button className="group flex items-center gap-2 px-6 py-2 font-medium text-gray-700 hover:text-indigo-600 transition">
                  {slide.buttonText2}
                  <Image
                    className="group-hover:translate-x-1 transition-transform"
                    src={assets.arrow_icon}
                    alt="arrow_icon"
                  />
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="flex items-center flex-1 justify-center">
              <Image
                className="md:w-80 w-52 drop-shadow-lg"
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-3 mt-6">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-3 w-3 rounded-full cursor-pointer transition-all duration-300 ${
              currentSlide === index
                ? "bg-indigo-600 scale-110 shadow-md"
                : "bg-gray-400/40 hover:bg-gray-500/70"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
