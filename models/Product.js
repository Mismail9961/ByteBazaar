import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: "user" },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, default: null },
    image: { type: [String], required: true }, // array of Cloudinary URLs
    category: { type: String, required: true },
  },
  { timestamps: true } // ✅ automatically adds createdAt & updatedAt
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
