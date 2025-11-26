"use client";
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const AddAddress = () => {
  const { router } = useAppContext();
  const { status } = useSession();

  const [address, setAddress] = useState({
    fullName: "",
    phoneNumber: "",
    pincode: "", // Changed from pinCode to match User model
    area: "",
    city: "",
    state: "",
    landmark: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (status !== "authenticated") {
      toast.error("Please sign in to add an address");
      router.push("/signin");
      return;
    }

    // Validation
    if (!address.fullName || !address.phoneNumber || !address.pincode || 
        !address.area || !address.city || !address.state) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Phone number validation (basic)
    if (!/^\d{10}$/.test(address.phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    // Pincode validation (basic)
    if (!/^\d{6}$/.test(address.pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await axios.post("/api/user/add-address", { address });

      if (data.success) {
        toast.success(data.message || "Address added successfully");
        router.push("/cart");
      } else {
        toast.error(data.message || "Failed to add address");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error(error.response?.data?.message || "Failed to add address");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (status === "loading") {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  // Show sign in prompt
  if (status === "unauthenticated") {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Sign in to add an address
            </h2>
            <button
              onClick={() => router.push("/signin")}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            >
              Sign In
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center px-6 md:px-16 py-20">
        {/* Animated Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-6xl rounded-2xl shadow-2xl bg-white/80 backdrop-blur-md p-10 flex flex-col md:flex-row gap-12"
        >
          {/* Form Section */}
          <motion.form
            onSubmit={onSubmitHandler}
            className="flex-1 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-800">
              Add <span className="text-orange-600">Shipping Address</span>
            </h2>
            <p className="text-gray-500 text-sm">
              Please fill out the form below to save your delivery details.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { 
                  id: "fullName", 
                  label: "Full name *", 
                  value: address.fullName,
                  type: "text"
                },
                {
                  id: "phoneNumber",
                  label: "Phone number *",
                  value: address.phoneNumber,
                  type: "tel",
                  maxLength: 10
                },
                { 
                  id: "pincode", 
                  label: "Pin code *", 
                  value: address.pincode,
                  type: "text",
                  maxLength: 6
                },
                { 
                  id: "city", 
                  label: "City/District/Town *", 
                  value: address.city,
                  type: "text"
                },
              ].map((field) => (
                <div className="relative" key={field.id}>
                  <input
                    type={field.type || "text"}
                    id={field.id}
                    value={field.value}
                    maxLength={field.maxLength}
                    onChange={(e) =>
                      setAddress({ ...address, [field.id]: e.target.value })
                    }
                    className="peer w-full border border-gray-300 rounded-xl px-3 pt-5 pb-2 text-gray-700 placeholder-transparent focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                    placeholder={field.label}
                    required
                  />
                  <label
                    htmlFor={field.id}
                    className="absolute left-3 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-orange-600"
                  >
                    {field.label}
                  </label>
                </div>
              ))}
            </div>

            {/* State */}
            <div className="relative">
              <input
                type="text"
                id="state"
                value={address.state}
                onChange={(e) =>
                  setAddress({ ...address, state: e.target.value })
                }
                className="peer w-full border border-gray-300 rounded-xl px-3 pt-5 pb-2 text-gray-700 placeholder-transparent focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                placeholder="State"
                required
              />
              <label
                htmlFor="state"
                className="absolute left-3 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-orange-600"
              >
                State *
              </label>
            </div>

            {/* Area */}
            <div className="relative">
              <textarea
                id="area"
                rows={4}
                value={address.area}
                onChange={(e) =>
                  setAddress({ ...address, area: e.target.value })
                }
                className="peer w-full border border-gray-300 rounded-xl px-3 pt-5 pb-2 text-gray-700 placeholder-transparent focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none resize-none"
                placeholder="Area"
                required
              ></textarea>
              <label
                htmlFor="area"
                className="absolute left-3 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-orange-600"
              >
                Address (Area & Street) *
              </label>
            </div>

            {/* Landmark (Optional) */}
            <div className="relative">
              <input
                type="text"
                id="landmark"
                value={address.landmark}
                onChange={(e) =>
                  setAddress({ ...address, landmark: e.target.value })
                }
                className="peer w-full border border-gray-300 rounded-xl px-3 pt-5 pb-2 text-gray-700 placeholder-transparent focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                placeholder="Landmark"
              />
              <label
                htmlFor="landmark"
                className="absolute left-3 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-orange-600"
              >
                Landmark (Optional)
              </label>
            </div>

            {/* Animated Submit button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
              className="w-full py-3 bg-orange-600 text-white rounded-xl font-semibold tracking-wide hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Address"}
            </motion.button>
          </motion.form>

          {/* Side Illustration */}
          <motion.div
            className="flex-1 flex items-center justify-center"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Image
              src={assets.my_location_image}
              alt="Location Illustration"
              className="w-80 h-auto drop-shadow-xl"
            />
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default AddAddress;