"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { useAppContext } from "@/context/AppContext";
import { assets, CartIcon } from "@/assets/assets";

const Navbar = () => {
  const { isSeller, router, getCartCount } = useAppContext();
  const { data: session, status, update } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);

  // Force session refresh on mount if user is authenticated
  React.useEffect(() => {
    if (status === "authenticated" && session) {
      update();
    }
  }, [status, update]);

  // Get user image with proxy for Google images
  const getUserImage = () => {
    if (!session?.user) return null;
    
    const user = session.user;
    const imageUrl = user.image || user.imageUrl || user.picture;
    
    if (imageUrl) {
      // If it's a Google image, use our proxy
      if (imageUrl.includes('googleusercontent.com')) {
        return `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
      }
      // If it's already a valid URL, use it directly
      if (imageUrl.startsWith('http')) {
        return imageUrl;
      }
    }
    
    // Fallback to UI Avatars
    const userName = user.name || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff&size=128`;
  };

  const userImage = getUserImage();
  const user = session?.user || null;

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-4">

        {/* Brand */}
        <h1
          onClick={() => router.push("/")}
          className="cursor-pointer text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text tracking-wide"
        >
          ByteBazaar
        </h1>

        {/* Navbar Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {["Home", "Shop", "About Us", "Contact"].map((item) => {
            const links = {
              Home: "/",
              Shop: "/all-products",
              "About Us": "/about-us",
              Contact: "/contact-us",
            };

            return (
              <Link key={item} href={links[item]} className="relative group">
                {item}
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            );
          })}

          {isSeller && (
            <button
              onClick={() => router.push("/seller")}
              className="text-xs font-semibold border border-indigo-500 text-indigo-600 px-5 py-2 rounded-full hover:bg-indigo-500 hover:text-white transition"
            >
              Seller Dashboard
            </button>
          )}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-6">
          {/* Search */}
          <Image
            src={assets.search_icon}
            alt="search"
            className="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100"
          />

          {user ? (
            <div className="flex items-center gap-4">

              {/* Cart */}
              <div
                onClick={() => router.push("/cart")}
                className="relative cursor-pointer"
              >
                <CartIcon className="w-6 h-6" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs px-2 rounded-full">
                    {getCartCount()}
                  </span>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <div
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
                >
                  {/* User Avatar */}
                  <div className="relative w-10 h-10 rounded-full border-2 border-indigo-500 overflow-hidden bg-indigo-100">
                    {userImage ? (
                      <img
                        src={userImage}
                        alt={user.name || "User"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=4F46E5&color=fff&size=128`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-indigo-600 font-bold">
                        {user.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-gray-800">{user.name}</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                </div>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        router.push("/profile");
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      Profile Settings
                    </button>
                    
                    <button
                      onClick={() => {
                        router.push("/orders");
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      My Orders
                    </button>
                    
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={() => {
                          signOut();
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="flex items-center gap-2 font-medium hover:text-indigo-600"
            >
              <Image src={assets.user_icon} alt="user" className="w-5 h-5" />
              Account
            </button>
          )}
        </div>

        {/* Mobile */}
        <div className="flex items-center md:hidden gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div
                onClick={() => router.push("/cart")}
                className="relative cursor-pointer"
              >
                <CartIcon className="w-6 h-6" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs px-1.5 rounded-full text-[10px]">
                    {getCartCount()}
                  </span>
                )}
              </div>
              
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative cursor-pointer"
              >
                {/* Mobile User Avatar */}
                <div className="relative w-9 h-9 rounded-full border-2 border-indigo-500 overflow-hidden bg-indigo-100">
                  {userImage ? (
                    <img
                      src={userImage}
                      alt={user.name || "User"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=4F46E5&color=fff&size=128`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-indigo-600 font-bold text-sm">
                      {user.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                
                {/* Mobile Dropdown */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        router.push("/profile");
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      Profile Settings
                    </button>
                    
                    <button
                      onClick={() => {
                        router.push("/orders");
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      My Orders
                    </button>
                    
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={() => {
                          signOut();
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button onClick={() => signIn()} className="flex items-center gap-2 font-medium">
              <Image src={assets.user_icon} alt="user" className="w-5 h-5" />
              Account
            </button>
          )}
        </div>
      </div>
      
      {/* Backdrop to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;