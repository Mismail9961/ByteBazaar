// Example: app/api/user/update-role/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/config/db";
import User from "@/models/User";

export async function PATCH(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role } = await request.json();
  
  await connectDB();
  await User.findByIdAndUpdate(session.user.id, { role });
  
  return NextResponse.json({ success: true });
}