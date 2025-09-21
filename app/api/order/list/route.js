import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";

export async function GET(request) {
  try {
    await connectDB();

    const { userId } = getAuth(request);

    // 🔐 Auth check
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Fetch orders with populated product details
    const orders = await Order.find({ userId })
      .populate({
        path: 'items.product',
        model: 'Product',
        select: 'name price offerPrice images'
      })
      .sort({ date: -1 }); // Most recent first

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}