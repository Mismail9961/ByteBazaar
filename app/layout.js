import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata = {
  title: "ByteBazaar | Premium Online Shopping Experience",
  description:
    "Shop smarter with ByteBazaar – your go-to destination for fashion, electronics, and lifestyle essentials. Fast checkout, secure payments, and doorstep delivery.",
  keywords: [
    "ByteBazaar",
    "e-commerce",
    "online shopping",
    "fashion store",
    "electronics",
    "lifestyle products",
    "buy online",
    "next.js e-commerce",
  ],
  openGraph: {
    title: "ByteBazaar | Premium Online Shopping Experience",
    description:
      "Discover fashion, electronics, and lifestyle essentials at ByteBazaar. Seamless shopping with fast delivery and secure payments.",
    url: "https://bytebazaarstore.vercel.app/",
    siteName: "ByteBazaar",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${outfit.className} antialiased text-gray-700`}>
          <Toaster />
          <AppContextProvider>{children}</AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
