import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request) {
  try {
    // Clerk authentication
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Connect DB
    await connectDB();

    // Find user by Clerk userId
    const user = await User.findById(userId);

    const {cartItems} = user

    // Return cart items
    return NextResponse.json({
      success: true,
      cartItems: user.cartItems || [],
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
