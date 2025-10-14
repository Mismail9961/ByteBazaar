import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";

export async function GET(request) {
  try {
    await connectDB();

    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    console.log("👤 Fetching orders for userId:", userId);

    const orders = await Order.find({ userId })
      .populate({
        path: "items.product",
        select: "name price offerPrice images",
      })
      .sort({ date: -1 });

    console.log("🧾 Orders found:", orders.length);
    if (orders.length === 0) console.log("⚠️ No orders found for this user.");

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("❌ Fetch orders error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
