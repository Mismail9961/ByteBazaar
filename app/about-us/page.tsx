// app/about/page.js (Next.js 13+ App Router)

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
    title: "About Us | ByteBazaar",
    description:
        "Learn more about ByteBazaar – your trusted online shopping destination for fashion, electronics, and lifestyle products. Discover our mission, values, and vision.",
};

export default function AboutPage() {
    return (
        <div>
            <Navbar />
            <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-16">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">About ByteBazaar</h1>
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                    Welcome to <span className="font-semibold">ByteBazaar</span> — a next-generation
                    e-commerce destination built for the modern shopper. We combine cutting-edge
                    technology with a passion for customer satisfaction to deliver a seamless,
                    secure, and enjoyable online shopping experience.
                </p>

                <div className="grid md:grid-cols-2 gap-12 mt-12">
                    {/* Mission */}
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
                        <p className="text-gray-700 leading-relaxed">
                            At ByteBazaar, our mission is simple: to make online shopping effortless
                            and accessible for everyone. From fashion and electronics to everyday
                            essentials, we aim to bring quality products to your doorstep with speed,
                            security, and convenience.
                        </p>
                    </div>

                    {/* Vision */}
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Vision</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We envision a digital marketplace where innovation meets trust. ByteBazaar
                            is more than a store — it’s a community of shoppers who value authenticity,
                            affordability, and an exceptional user experience.
                        </p>
                    </div>
                </div>

                {/* Values */}
                <div className="mt-16">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Core Values</h2>
                    <ul className="space-y-4 text-gray-700">
                        <li>✅ <span className="font-medium">Customer First</span> – every decision we make starts with you.</li>
                        <li>✅ <span className="font-medium">Quality & Trust</span> – only the best, reliable products make it to our store.</li>
                        <li>✅ <span className="font-medium">Innovation</span> – harnessing the latest tech to improve your shopping journey.</li>
                        <li>✅ <span className="font-medium">Sustainability</span> – committed to eco-friendly practices and conscious commerce.</li>
                    </ul>
                </div>

                {/* Call to Action */}
                <div className="mt-20 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Join the ByteBazaar Experience
                    </h2>
                    <p className="text-lg text-gray-700 mb-8">
                        From your first click to the final checkout, ByteBazaar is here to make
                        shopping smarter, faster, and better. Explore our collections today and
                        discover why thousands of customers trust us.
                    </p>
                    <a
                        href="/shop"
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 transition"
                    >
                        Start Shopping
                    </a>
                </div>
            </div>
            <Footer/>
        </div>
    );
}
