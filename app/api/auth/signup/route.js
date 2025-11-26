
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/config/db.js";
import User from "@/models/User";
import { randomBytes } from "crypto";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await dbConnect();
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `user_${randomBytes(16).toString("hex")}`;

    const user = await User.create({
      _id: userId,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      provider: "credentials",
      imageUrl: "",
      cartItems: [],
      role: "customer", // default role
    });

    return NextResponse.json({ message: "User created successfully", userId: user._id }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
