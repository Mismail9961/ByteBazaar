// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/config/db";
import User from "@/models/User";
import { v4 as uuidv4 } from "uuid";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: { 
        params: { 
          prompt: "consent", 
          access_type: "offline", 
          response_type: "code" 
        } 
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Validate credentials exist
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          await dbConnect();
          
          const user = await User.findOne({ 
            email: credentials.email.toLowerCase() 
          });

          if (!user) {
            return null; // Changed from throw to return null
          }

          if (!user.password) {
            return null; // Changed from throw to return null
          }

          const isValid = await bcrypt.compare(
            credentials.password, 
            user.password
          );

          if (!isValid) {
            return null; // Changed from throw to return null
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.imageUrl,
            imageUrl: user.imageUrl,
            role: user.role || "customer",
          };
        } catch (error) {
          console.error("❌ Authorize error:", error);
          return null; // Always return null on error
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await dbConnect();

        if (account?.provider === "google") {
          let existingUser = await User.findOne({ 
            email: user.email.toLowerCase() 
          });
          
          if (!existingUser) {
            const userId = `user_${uuidv4().replace(/-/g, '')}`;
            
            existingUser = await User.create({
              _id: userId,
              name: user.name || profile.name,
              email: user.email.toLowerCase(),
              imageUrl: user.image || profile.picture || "",
              googleId: profile.sub,
              provider: "google",
              cartItems: {},
              role: "customer",
              emailVerified: true,
            });

            console.log("✅ New Google user created:", existingUser._id);
          } else if (!existingUser.googleId) {
            existingUser.googleId = profile.sub;
            existingUser.imageUrl = user.image || profile.picture || existingUser.imageUrl;
            existingUser.provider = "google";
            existingUser.emailVerified = true;
            await existingUser.save();
            
            console.log("✅ Google account linked:", existingUser._id);
          } else {
            console.log("✅ Existing Google user signed in:", existingUser._id);
          }

          user.id = existingUser._id.toString();
          user.role = existingUser.role || "customer";
          user.image = existingUser.imageUrl;
          user.imageUrl = existingUser.imageUrl;
        }

        return true;
      } catch (error) {
        console.error("❌ SignIn callback error:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.image = user.image || user.imageUrl;
        token.imageUrl = user.imageUrl || user.image;
      }

      if (token.id && !user) {
        try {
          await dbConnect();
          const freshUser = await User.findById(token.id);
          if (freshUser) {
            token.role = freshUser.role;
            token.image = freshUser.imageUrl;
            token.imageUrl = freshUser.imageUrl;
          }
        } catch (error) {
          console.error("❌ JWT callback error:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role || "customer";
        session.user.image = token.image || token.imageUrl;
        session.user.imageUrl = token.imageUrl || token.image;
      }
      return session;
    },
  },

  session: { 
    strategy: "jwt", 
    maxAge: 30 * 24 * 60 * 60 
  },
  
  pages: { 
    signIn: "/login", 
    error: "/login" 
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };