import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#F9FAFB] border-t border-gray-200 mt-12 sm:mt-16">
      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-12 sm:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 text-gray-600">
        
        {/* Brand Info */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-blue-600">ByteBazaar</h1>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed">
            Your one-stop destination for the latest electronics. From gadgets to gear, 
            we bring innovation closer to you with quality you can trust.
          </p>
          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-5 sm:mt-6">
            <a href="#" className="hover:text-orange-600 transition" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="#" className="hover:text-orange-600 transition" aria-label="Twitter">
              <Twitter size={18} />
            </a>
            <a href="#" className="hover:text-orange-600 transition" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="#" className="hover:text-orange-600 transition" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-4 sm:mb-5">Company</h2>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li><a className="hover:text-orange-600 transition" href="#">Home</a></li>
            <li><a className="hover:text-orange-600 transition" href="#">About Us</a></li>
            <li><a className="hover:text-orange-600 transition" href="#">Contact Us</a></li>
            <li><a className="hover:text-orange-600 transition" href="#">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-4 sm:mb-5">Support</h2>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li><a className="hover:text-orange-600 transition" href="#">Help Center</a></li>
            <li><a className="hover:text-orange-600 transition" href="#">Returns & Refunds</a></li>
            <li><a className="hover:text-orange-600 transition" href="#">Shipping Info</a></li>
            <li><a className="hover:text-orange-600 transition" href="#">FAQs</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-4 sm:mb-5">Get in Touch</h2>
          <p className="text-xs sm:text-sm">📞 +1-234-567-890</p>
          <p className="text-xs sm:text-sm">✉️ support@bytebazaar.com</p>
          <p className="text-xs sm:text-sm mt-3">📍 123 Tech Street, Silicon Valley, CA</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 py-4 sm:py-5">
        <p className="text-center text-[10px] sm:text-xs md:text-sm text-gray-500">
          © {new Date().getFullYear()} ByteBazaar. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
