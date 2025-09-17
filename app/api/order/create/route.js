import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { inngest } from "@/config/inngest";
import connectDB from "@/config/db";

export async function POST(request) {
  try {
    await connectDB();

    const { userId } = getAuth(request);
    const { address, items } = await request.json();

    // 🔐 Auth check
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // 🔎 Validate inputs
    if (!address || typeof address !== "string" || address.trim().length === 0) {
      return NextResponse.json({ success: false, message: "Invalid address" }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, message: "No items in order" }, { status: 400 });
    }
    if (items.some(i => !i.product || !i.quantity || i.quantity <= 0)) {
      return NextResponse.json({ success: false, message: "Invalid items payload" }, { status: 400 });
    }

    // 🔎 Fetch products
    const productIds = items.map((i) => i.product);
    const products = await Product.find({ _id: { $in: productIds } });

    // Keep only valid items
    const validItems = items.filter((item) =>
      products.find((p) => p._id.toString() === item.product)
    );

    if (validItems.length === 0) {
      return NextResponse.json(
        { success: false, message: "All products are unavailable" },
        { status: 400 }
      );
    }

    // 💰 Calculate totals
    const subtotal = validItems.reduce((acc, item) => {
      const product = products.find((p) => p._id.toString() === item.product);
      return acc + (product.offerPrice ?? product.price) * item.quantity;
    }, 0);

    const totalAmount = subtotal + Math.round(subtotal * 0.02); // 2% fee

    // 📩 Send order event to Inngest
    await inngest.send({
      name: "order/created",
      data: {
        userId,
        address,
        items: validItems,
        amount: totalAmount,
        date: Date.now(),
      },
    });

    // 🛒 Clear user cart (best-effort)
    try {
      const user = await User.findOne({ clerkId: userId });
      if (user) {
        user.cartItems = {};
        await user.save();
      }
    } catch (cartErr) {
      console.warn("⚠️ Failed to clear cart:", cartErr);
    }

    return NextResponse.json({
      success: true,
      message: "Order Placed",
      skippedProducts: productIds.filter(
        (id) => !products.find((p) => p._id.toString() === id.toString())
      ),
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
