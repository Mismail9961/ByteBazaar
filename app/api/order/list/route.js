import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";

export async function GET(request) {
  try {
    await connectDB();

    const { userId } = getAuth(request);

    // 🔐 Must be logged in
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 📦 Fetch orders belonging to this user
    const orders = await Order.find({ userId })
      .populate("items.product", "name price offerPrice") // only send required fields
      .sort({ date: -1 });

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Fetch user orders error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
