import { Outfit } from "next/font/google";
import "./globals.css";
import connectDB from "@/config/db";
import Seo from "@/models/Seo";
import ClientProviders from "./ClientProviders";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"] });

export async function generateMetadata() {
  await connectDB();

  const seo = await Seo.findOne();

  return {
    title: seo?.title,
    description: seo?.description,
    keywords: seo?.keywords,
    openGraph: seo?.openGraph,
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased text-gray-700`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
