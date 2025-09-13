import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items } = await request.json();

    if (!address || address.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid address" });
    }

    const amounts = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        return product.offerPrice * item.quantity;
      })
    );

    const amount = amounts.reduce((acc, val) => acc + val, 0);

    return NextResponse.json({ success: true, amount });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
