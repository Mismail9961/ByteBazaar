import Product from "@/models/Product";
import User from "@/models/User";
import Address from "@/models/Address";
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

    // Debug: Log the received data
    console.log("📦 Received order data:", { address, items });
    console.log("👤 User ID:", userId);

    let addressData;

    // Handle both address object and address ID
    if (typeof address === "string") {
      // Address is an ID, fetch the actual address
      try {
        addressData = await Address.findById(address);
        if (!addressData) {
          return NextResponse.json({ 
            success: false, 
            message: "Address not found" 
          }, { status: 400 });
        }
        console.log("📍 Fetched address data:", addressData);
      } catch (err) {
        return NextResponse.json({ 
          success: false, 
          message: "Invalid address ID" 
        }, { status: 400 });
      }
    } else if (typeof address === "object" && address !== null) {
      // Address is already an object
      addressData = address;
    } else {
      return NextResponse.json({ 
        success: false, 
        message: `Invalid address. Received: ${typeof address}` 
      }, { status: 400 });
    }

    // Validate required address fields
    const requiredAddressFields = ['fullName', 'phoneNumber', 'pinCode', 'area', 'city', 'state'];
    const missingFields = requiredAddressFields.filter(field => !addressData[field]);
    
    if (missingFields.length > 0) {
      console.log("❌ Missing address fields:", missingFields);
      return NextResponse.json({ 
        success: false, 
        message: `Missing address fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // Validate items
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

    console.log("💰 Calculated total amount:", totalAmount);

    // 📩 Send to Inngest for order creation (ONLY method for creating orders)
    try {
      await inngest.send({
        name: "order/created",
        data: {
          userId,
          address: {
            fullName: addressData.fullName,
            phoneNumber: addressData.phoneNumber,
            pinCode: addressData.pinCode,
            area: addressData.area,
            city: addressData.city,
            state: addressData.state,
          },
          items: validItems,
          amount: totalAmount,
          date: Date.now(),
          status: "Order Placed"
        },
      });
      console.log("✅ Inngest event sent successfully");
    } catch (inngestError) {
      console.error("❌ Inngest event failed:", inngestError.message);
      return NextResponse.json({ 
        success: false, 
        message: "Failed to process order: " + inngestError.message 
      }, { status: 500 });
    }

    // 🛒 Clear user cart (best-effort)
    try {
      const user = await User.findOne({ clerkId: userId });
      if (user) {
        user.cartItems = {};
        await user.save();
        console.log("✅ Cart cleared successfully");
      }
    } catch (cartErr) {
      console.warn("⚠️ Failed to clear cart:", cartErr);
    }

    return NextResponse.json({
      success: true,
      message: "Order Placed Successfully",
      skippedProducts: productIds.filter(
        (id) => !products.find((p) => p._id.toString() === id.toString())
      ),
    });
  } catch (error) {
    console.error("❌ Order creation error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}