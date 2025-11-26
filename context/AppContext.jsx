"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const user = session?.user
    ? { ...session.user, image: session.user.image || session.user.imageUrl || "/default-avatar.png" }
    : null;

  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [cartItems, setCartItems] = useState({});
  const [isLoadingCart, setIsLoadingCart] = useState(false);

  // Immediate seller check from session
  const isSeller = user ? user.role === "seller" || user.role === "admin" : false;

  // Fetch products
  const fetchProductData = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) setProducts(data.products);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch user data
  const fetchUserData = async () => {
    if (status !== "authenticated") return;
    
    try {
      const { data } = await axios.get("/api/user/data");
      if (data.success) {
        setUserData(data.user);
        setCartItems(data.user.cartItems || {});
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    }
  };

  // Fetch cart items
  const fetchCartItems = async () => {
    if (status !== "authenticated") return;
    
    setIsLoadingCart(true);
    try {
      const { data } = await axios.get("/api/cart/get");
      if (data.success) {
        setCartItems(data.cartItems || {});
      } else {
        console.error("Failed to fetch cart:", data.message);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoadingCart(false);
    }
  };

  // Load products on mount
  useEffect(() => {
    fetchProductData();
  }, []);

  // Load user data and cart when authenticated
  useEffect(() => {
    if (status === "authenticated") {
      fetchUserData();
      fetchCartItems();
    } else if (status === "unauthenticated") {
      setUserData(null);
      setCartItems({});
    }
  }, [status]);

  const addToCart = async (itemId) => {
    const cartData = structuredClone(cartItems);
    cartData[itemId] = (cartData[itemId] || 0) + 1;
    setCartItems(cartData);

    if (status === "authenticated") {
      try {
        const { data } = await axios.post("/api/cart/update", { cartData });
        if (data.success) {
          toast.success("Item added to cart");
        } else {
          toast.error(data.message);
          // Revert on failure
          setCartItems(cartItems);
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("Failed to add item to cart");
        // Revert on failure
        setCartItems(cartItems);
      }
    } else {
      toast.error("Please sign in to add items to cart");
      // Revert the optimistic update
      setCartItems(cartItems);
    }
  };

  const updateCartQuantity = async (itemId, quantity) => {
    const cartData = structuredClone(cartItems);
    
    if (quantity === 0) {
      delete cartData[itemId];
    } else if (quantity > 0) {
      cartData[itemId] = quantity;
    } else {
      return; // Don't allow negative quantities
    }
    
    setCartItems(cartData);

    if (status === "authenticated") {
      try {
        const { data } = await axios.post("/api/cart/update", { cartData });
        if (data.success) {
          toast.success(quantity === 0 ? "Item removed from cart" : "Cart updated");
        } else {
          toast.error(data.message);
          // Revert on failure
          setCartItems(cartItems);
        }
      } catch (error) {
        console.error("Error updating cart:", error);
        toast.error("Failed to update cart");
        // Revert on failure
        setCartItems(cartItems);
      }
    } else {
      toast.error("Please sign in to update cart");
      // Revert the optimistic update
      setCartItems(cartItems);
    }
  };

  const getCartCount = () =>
    Object.values(cartItems).reduce((acc, qty) => acc + qty, 0);

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((p) => p._id === itemId);
      if (itemInfo) {
        totalAmount += itemInfo.offerPrice * (cartItems[itemId] || 0);
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  return (
    <AppContext.Provider value={{
      user,
      currency,
      router,
      isSeller,
      userData,
      products,
      cartItems,
      setCartItems,
      isLoadingCart,
      addToCart,
      updateCartQuantity,
      getCartCount,
      getCartAmount,
      fetchCartItems
    }}>
      {children}
    </AppContext.Provider>
  );
};