import { v2 as cloudinary } from "cloudinary";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller"; // adjust path if needed
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401 }
      );
    }

    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return new Response(
        JSON.stringify({ error: "Not a seller" }),
        { status: 403 }
      );
    }


    const formData = await request.formData()

    const name = formData.get('name')
    const description = formData.get('description')
    const category = formData.get('category')
    const price = formData.get('price')
    const offerPrice = formData.get('offerPrice')

    const images = formData.getAll('images')

    if (!files || files.length === 0) {
        return NextResponse.json({success:false,message:"no files uploaded"})
    }


    // here you’d handle Cloudinary upload token/signature
    // Example: generate upload signature
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp },
      process.env.CLOUDINARY_API_SECRET
    );

    return new Response(
      JSON.stringify({
        signature,
        timestamp,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    );
  }
}
