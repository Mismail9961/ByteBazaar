import User from "@/models/User";
import dbConnect from "@/config/db.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) return new Response(JSON.stringify({ error: "Email required" }), { status: 400 });

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

    // Generate token
    const token = crypto.randomBytes(20).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    await transporter.sendMail({
      from: `"Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset.</p>
             <p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    return new Response(JSON.stringify({ message: "Reset email sent" }), { status: 200 });
  } catch (err) {
    console.error("Forgot password error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}