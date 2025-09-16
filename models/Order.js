import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { 
    type: String,   // 🔹 Store Clerk's userId as string
    required: true 
  },
  items: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product", 
        required: true 
      },
      quantity: { type: Number, required: true },
    }
  ],
  amount: { type: Number, required: true },
  address: { 
    type: String,   // 🔹 Can keep this as string if you’re not using Address collection
    required: true 
  },
  status: { type: String, required: true, default: "Order Placed" },
  date: { type: Date, default: Date.now },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
