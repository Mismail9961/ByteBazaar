import React from "react";

const NewsLetter = () => {
  return (
    <section className="relative flex flex-col items-center justify-center text-center py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-r from-[#fdfbfb] to-[#ebedee] rounded-2xl shadow-md my-10 sm:my-16 overflow-hidden">
      {/* Decorative Background Accent */}
      <div className="absolute inset-0 bg-[#5F65F0]/10 rounded-2xl blur-2xl -z-10"></div>

      {/* Title */}
      <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-900 leading-snug">
        Subscribe now & get{" "}
        <span className="text-[#5F65F0]">20% off</span>
      </h1>

      {/* Subtitle */}
      <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-md sm:max-w-xl mt-3 mb-8 px-2">
        Join our newsletter for exclusive deals, the latest tech drops, and insider updates. Don’t miss out!
      </p>

      {/* Input + Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full max-w-md sm:max-w-2xl rounded-full sm:rounded-full overflow-hidden shadow-lg border border-gray-300/40 bg-white">
        <input
          className="flex-1 px-4 sm:px-6 py-3 sm:py-4 text-gray-700 placeholder-gray-400 focus:outline-none text-sm sm:text-base border-b sm:border-b-0 sm:border-r border-gray-200"
          type="email"
          placeholder="Enter your email address"
        />
        <button className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 bg-[#5F65F0] hover:bg-[#4c52d1] text-white font-medium text-sm sm:text-base transition duration-300">
          Subscribe
        </button>
      </div>

      {/* Small note */}
      <p className="text-[10px] sm:text-xs text-gray-400 mt-4">
        We respect your privacy. Unsubscribe anytime.
      </p>
    </section>
  );
};

export default NewsLetter;
