import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { inngest } from "@/config/inngest";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items } = await request.json();

    // 🔹 Validate inputs
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    if (!address || address.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid address" }, { status: 400 });
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, message: "No items in order" }, { status: 400 });
    }

    // 🔹 Fetch all products
    const productIds = items.map((i) => i.product);
    const products = await Product.find({ _id: { $in: productIds } });

    // 🔹 Keep only valid items (skip missing products)
    const validItems = items.filter((item) =>
      products.find((p) => p._id.toString() === item.product)
    );

    if (validItems.length === 0) {
      return NextResponse.json(
        { success: false, message: "All products are unavailable" },
        { status: 400 }
      );
    }

    // 🔹 Calculate subtotal
    const subtotal = validItems.reduce((acc, item) => {
      const product = products.find((p) => p._id.toString() === item.product);
      return acc + (product.offerPrice ?? product.price) * item.quantity;
    }, 0);

    const totalAmount = subtotal + Math.floor(subtotal * 0.02); // add 2% fee

    // 🔹 Send order event to Inngest
    await inngest.send({
      name: "order/created",
      data: {
        userId,
        address,
        items: validItems, // only valid products
        amount: totalAmount,
        date: Date.now(),
      },
    });

    // 🔹 Clear User Cart (assuming clerkId is stored in User model)
    const user = await User.findOne({ clerkId: userId });
    if (user) {
      user.cartItems = {};
      await user.save();
    }

    return NextResponse.json({
      success: true,
      message: "Order Placed",
      skippedProducts: productIds.filter(
        (id) => !products.find((p) => p._id.toString() === id.toString())
      ), // list of removed products
    });
  } catch (error) {
    console.error("Order creation error:", error.message);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
