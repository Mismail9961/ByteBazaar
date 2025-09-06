import { v2 as cloudinary } from "cloudinary";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller"; 
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "../../../../models/Product";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ error: "Not a seller" }, { status: 403 });
    }

    const formData = await request.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const category = formData.get("category");
    const price = formData.get("price");
    const offerPrice = formData.get("offerPrice");

    const files = formData.getAll("images");

    if (!files || files.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No files uploaded",
      });
    }

    // Upload images to Cloudinary
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(buffer);
        });
      })
    );

    const imageUrls = uploadResults.map((r) => r.secure_url);

    await connectDB();

const newProduct = await Product.create({
  userId,
  name,
  description,
  category,
  price: Number(price),
  offerPrice: offerPrice ? Number(offerPrice) : null,
  image: imageUrls,
  date: Date.now(),   // 👈 added
});


    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      data: newProduct, // includes createdAt, updatedAt, etc.
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
