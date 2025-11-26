// app/api/auth/[...nextauth]/route.js
import { authHandler } from "@/lib/auth";

export { authHandler as GET, authHandler as POST };
