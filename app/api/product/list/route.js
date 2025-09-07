// app/api/product/home/route.js
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    // ✅ Fetch latest 12 products based on createdAt
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(12);

    return NextResponse.json(
      { success: true, products },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching home products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load products" },
      { status: 500 }
    );
  }
}
