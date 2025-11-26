import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { address } = await request.json();

    // Validate required fields
    if (!address || !address.fullName || !address.phoneNumber || 
        !address.pincode || !address.area || !address.city || !address.state) {
      return NextResponse.json(
        { success: false, message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(address.phoneNumber)) {
      return NextResponse.json(
        { success: false, message: "Phone number must be 10 digits" },
        { status: 400 }
      );
    }

    // Validate pincode (6 digits)
    if (!/^\d{6}$/.test(address.pincode)) {
      return NextResponse.json(
        { success: false, message: "Pincode must be 6 digits" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Create new address object
    const newAddress = {
      fullName: address.fullName.trim(),
      phoneNumber: address.phoneNumber.trim(),
      area: address.area.trim(),
      city: address.city.trim(),
      state: address.state.trim(),
      pincode: address.pincode.trim(),
      landmark: address.landmark?.trim() || "",
      isDefault: user.addresses.length === 0, // First address is default
    };

    // Add address to user's addresses array
    user.addresses.push(newAddress);
    await user.save();

    // Get the newly added address (last one in array)
    const addedAddress = user.addresses[user.addresses.length - 1];

    return NextResponse.json({
      success: true,
      message: "Address added successfully",
      address: addedAddress,
    });
  } catch (error) {
    console.error("Error adding address:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}