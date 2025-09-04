import { auth, currentUser } from "@clerk/nextjs/server";
import User from "@/models/User";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";

export async function GET(request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({success:false,message:"Unauthorized"})
    }
    
    await connectDB()
    let user = await User.findById(userId)

    if(!user){
      console.log("🔄 Fetching current user from Clerk for:", userId)
      
      try {
        // Get current user directly
        const clerkUser = await currentUser()
        
        if (!clerkUser) {
          throw new Error("No current user found")
        }
        
        user = new User({
          _id: userId,
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || "Unnamed User",
          email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
          imageUrl: clerkUser.imageUrl || ""
        })
        
        await user.save()
        console.log("✅ Real user data created from currentUser:", userId)
        
      } catch (clerkError) {
        console.error("❌ currentUser error:", clerkError.message)
        return NextResponse.json({
          success: false, 
          message: `Could not get current user: ${clerkError.message}`
        })
      }
    }

    return NextResponse.json({success:true,user})
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({success:false,message:error.message})
  }
}