// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// IMPORTANT: Do not export authOptions from this file
// It's already exported from @/lib/auth for use in other API routes

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };