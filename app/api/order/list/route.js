import Order from "@/models/Order";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";

export async function GET(request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id || session.user.email;
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