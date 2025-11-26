// lib/authSeller.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth"; // ✅ correct import path

const authSeller = async (req) => {
  try {
    const session = await getServerSession(authOptions, req);

    if (!session) return false; // Not logged in

    const role = session.user.role;
    return role === "seller" || role === "admin";
  } catch (error) {
    console.error("authSeller error:", error);
    return false;
  }
};

export default authSeller;
