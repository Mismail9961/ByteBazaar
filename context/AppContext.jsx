"use client";
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = (props) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [cartItems, setCartItems] = useState({});

  // Fetch products (dummy for now)
  const fetchProductData = async () => {
    setProducts(productsDummyData);
  };

  // Fetch user data from API
  const fetchUserData = async () => {
    try {
      if (user?.publicMetadata?.role === "seller") {
        setIsSeller(true);

        const token = await getToken();

        const res = await axios.get("/api/user/data", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data; // ✅ Correctly access response body

        if (data.success) {
          setUserData(data.user);
          setCartItems(data.user.cartItems || {}); // ✅ fallback in case it's null
        } else {
          toast.error(data.message || "Failed to fetch user data");
        }
      } else {
        setIsSeller(false);
        setUserData(userDummyData); // fallback for non-sellers
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Add item to cart
  const addToCart = async (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
  };

  // Update cart item quantity
  const updateCartQuantity = async (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity === 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);
  };

  // Count total items in cart
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      if (cartItems[items] > 0) {
        totalCount += cartItems[items];
      }
    }
    return totalCount;
  };

  // Calculate total cart amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      if (cartItems[items] > 0) {
        let itemInfo = products.find((product) => product._id === items);
        if (itemInfo) {
          totalAmount += itemInfo.offerPrice * cartItems[items];
        }
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  // Initial fetch for products
  useEffect(() => {
    fetchProductData();
  }, []);

  // Fetch user data when Clerk user changes
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const value = {
    getToken,
    user,
    currency,
    router,
    isSeller,
    setIsSeller,
    userData,
    fetchUserData,
    products,
    fetchProductData,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
