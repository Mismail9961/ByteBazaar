import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";

// ✅ PUBLIC ENDPOINT - No authentication required
// Anyone can view products (signed in or not)
export async function GET() {
  try {
    await connectDB();

    // Fetch all products - no user filtering
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .select('-__v') // Exclude version key
      .lean();

    return NextResponse.json({ 
      success: true, 
      products,
      count: products.length 
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Server error",
      products: [] // Return empty array on error
    }, { status: 500 });
  }
}