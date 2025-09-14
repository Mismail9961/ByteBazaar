import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { inngest } from "@/config/inngest";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items } = await request.json();

    if (!address || address.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid address" });
    }

    // Calculate total amount
    const amount = (await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        return product.offerPrice * item.quantity;
      })
    )).reduce((acc, val) => acc + val, 0);

    // Send order event to Inngest
    await inngest.send({
      name: "order/created",
      data: {
        userId,
        address,
        items,
        amount: amount + Math.floor(amount * 0.02), // add 2% fee
        date: Date.now(),
      },
    });

    //Clear User Cart
    const user = await User.findById(userId)
    user.cartItems = {}
    await user.save()

    return NextResponse.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
