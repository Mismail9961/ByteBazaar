import User from "@/models/User";
import dbConnect from "@/config/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { token, email, newPassword } = await req.json();
    if (!token || !email || !newPassword)
      return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });

    await dbConnect();

    const user = await User.findOne({
      email,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user)
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 400 });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    return new Response(JSON.stringify({ message: "Password reset successful!" }), { status: 200 });
  } catch (err) {
    console.error("Reset password error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}