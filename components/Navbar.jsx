"use client";
import React from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton, useUser } from "@clerk/nextjs";

const Navbar = () => {
  const { isSeller, router } = useAppContext();
  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();

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

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {["Home", "Shop", "About Us", "Contact"].map((item, i) => {
            let href = "/";
            if (item === "Shop") href = "/all-products";
            if (item === "About Us") href = "/about-us";
            if (item === "Contact") href = "/contact-us";

            return (
              <Link
                key={i}
                href={href}
                className="relative group transition"
              >
                {item}
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-indigo-500 transition-all duration-300 group-hover:w-full" />
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

        {/* Right side (desktop) */}
        <div className="hidden md:flex items-center gap-5">
          <Image
            className="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100 transition"
            src={assets.search_icon}
            alt="search"
          />

          {isSignedIn ? (
            <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }}>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="Cart"
                  labelIcon={<CartIcon />}
                  onClick={() => router.push("/cart")}
                />
                <UserButton.Action
                  label="My Orders"
                  labelIcon={<BagIcon />}
                  onClick={() => router.push("/my-orders")}
                />
              </UserButton.MenuItems>
            </UserButton>
          ) : (
            <button
              onClick={openSignIn}
              className="flex items-center gap-2 font-medium hover:text-indigo-600 transition"
            >
              <Image
                src={assets.user_icon}
                alt="user"
                className="w-5 h-5 opacity-80"
              />
              Account
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center md:hidden gap-3">
          {isSeller && (
            <button
              onClick={() => router.push("/seller")}
              className="text-xs border border-indigo-500 text-indigo-600 px-3 py-1.5 rounded-full hover:bg-indigo-500 hover:text-white transition"
            >
              Seller
            </button>
          )}

          {isSignedIn ? (
            <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }}>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="Home"
                  labelIcon={<HomeIcon />}
                  onClick={() => router.push("/")}
                />
                <UserButton.Action
                  label="Products"
                  labelIcon={<BoxIcon />}
                  onClick={() => router.push("/all-products")}
                />
                <UserButton.Action
                  label="Cart"
                  labelIcon={<CartIcon />}
                  onClick={() => router.push("/cart")}
                />
                <UserButton.Action
                  label="My Orders"
                  labelIcon={<BagIcon />}
                  onClick={() => router.push("/my-orders")}
                />
              </UserButton.MenuItems>
            </UserButton>
          ) : (
            <button
              onClick={openSignIn}
              className="flex items-center gap-2 font-medium hover:text-indigo-600 transition"
            >
              <Image
                src={assets.user_icon}
                alt="user"
                className="w-5 h-5 opacity-80"
              />
              Account
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
