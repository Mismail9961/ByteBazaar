import connectDB from "@/config/db";
import User from "@/models/User"; // ✅ fixed path
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const cartData = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    user.cartItems = cartData;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Cart updated successfully",
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
