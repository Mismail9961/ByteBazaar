import { getAuth } from "@clerk/nextjs/server";
import User from "@/models/User";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";

export async function GET(request) {
  try {
    const {userId} = await getAuth(request)
    
    if (!userId) {
      return NextResponse.json({success:false,message:"Unauthorized"})
    }
    
    await connectDB()
    let user = await User.findById(userId)

    if(!user){
      console.log("🔄 Creating temporary user for:", userId)
      user = new User({
        _id: userId,
        name: "Loading...",
        email: `temp-${userId}@placeholder.local`, // ✅ Temporary email
        imageUrl: ""
      })
      
      await user.save()
      console.log("✅ Temporary user created, webhook will update:", userId)
    }

    return NextResponse.json({success:true,user})
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({success:false,message:error.message})
  }
}