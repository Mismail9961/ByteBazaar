import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";

export async function GET() {
  try {
    // connect to MongoDB
    await connectDB();

    // fetch all orders, populate products inside items
    const orders = await Order.find()
      .populate("items.product") // optional: fetch product details
      .sort({ createdAt: -1 });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch orders", error: error.message },
      { status: 500 }
    );
  }
}
