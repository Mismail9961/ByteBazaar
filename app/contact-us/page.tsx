"use client"

import React, { useState } from "react";
import { Mail, Phone, MapPin, XCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type FormState = {
  name: string;
  email: string;
  orderNumber?: string;
  subject: string;
  message: string;
};

export default function ContactUs() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    orderNumber: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  function validate(): boolean {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!form.email.trim()) e.email = "Please enter your email.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "Please enter a valid email.";
    if (!form.subject.trim()) e.subject = "Subject is required.";
    if (!form.message.trim() || form.message.trim().length < 10) e.message = "Message should be at least 10 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(null);
    setServerError(null);
    if (!validate()) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Server error. Please try again later.");
      }

      setSuccess("Thanks! Your message was sent. We'll reply within 24 hours.");
      setForm({ name: "", email: "", orderNumber: "", subject: "", message: "" });
      setErrors({});
    } catch (err: any) {
      setServerError(err?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
        <Navbar/>
        <main className="max-w-6xl mx-auto px-6 py-12 bg-white text-[#5C66F0]">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-semibold">Contact Us</h1>
        <p className="mt-2 text-[#5C66F0]/80">Need help with an order, returns or product details? We&apos;re here for you.</p>
      </motion.header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: contact card + map */}
        <aside className="space-y-6">
          <div className="rounded-2xl p-6 shadow-sm border bg-[#5C66F0] text-white">
            <h3 className="text-lg font-medium">Customer Support</h3>
            <p className="mt-2 text-sm text-white/80">Mon - Fri: 9:00 — 18:00 (PKT)</p>

            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 shrink-0" />
                <div>
                  <dt className="font-medium">Phone</dt>
                  <dd className="text-white/80">+92 3102437201</dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 shrink-0" />
                <div>
                  <dt className="font-medium">Email</dt>
                  <dd className="text-white/80">sheikhmuhammadismail79@gmail.com</dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 shrink-0" />
                <div>
                  <dt className="font-medium">Address</dt>
                  <dd className="text-white/80">Gulberg, Karachi, Pakistan</dd>
                </div>
              </div>
            </dl>

            <div className="mt-6 flex gap-3">
              <a href="/faq" className="text-sm underline">FAQ</a>
              <a href="/returns" className="text-sm underline">Returns & Refunds</a>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border">
            <iframe
              title="Store location"
              className="w-full h-52"
              loading="lazy"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.1234567890123!2d74.3587!3d31.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190123456789ab%3A0xc0ffee123456789!2sGulberg%2C%20Lahore!5e0!3m2!1sen!2s!4v1699999999999"
            />
          </div>

          <div className="rounded-2xl p-4 bg-[#5C66F0]/10 border border-[#5C66F0]">
            <h4 className="text-sm font-medium">Pro tip</h4>
            <p className="text-sm mt-2">Include your order number if your message is about an existing order — it helps us resolve things faster.</p>
          </div>
        </aside>

        {/* Right: form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 rounded-2xl border p-6 bg-white shadow-sm"
          aria-label="Contact form"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Full name</label>
              <input
                className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 ${errors.name ? 'border-red-400 focus:ring-red-200' : 'border-[#5C66F0]'}`}
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                placeholder="Your full name"
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 ${errors.email ? 'border-red-400 focus:ring-red-200' : 'border-[#5C66F0]'}`}
                value={form.email}
                onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                placeholder="you@domain.com"
                type="email"
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">Order number (optional)</label>
              <input
                className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm border-[#5C66F0]"
                value={form.orderNumber}
                onChange={(e) => setForm((s) => ({ ...s, orderNumber: e.target.value }))}
                placeholder="e.g. #123456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Subject</label>
              <input
                className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 ${errors.subject ? 'border-red-400 focus:ring-red-200' : 'border-[#5C66F0]'}`}
                value={form.subject}
                onChange={(e) => setForm((s) => ({ ...s, subject: e.target.value }))}
                placeholder="What is this about?"
              />
              {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject}</p>}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium">Message</label>
            <textarea
              className={`mt-1 block w-full rounded-md border px-3 py-2 min-h-[140px] shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 ${errors.message ? 'border-red-400 focus:ring-red-200' : 'border-[#5C66F0]'}`}
              value={form.message}
              onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
              placeholder="Tell us what's happening and what you'd like us to do — include relevant details."
            />
            {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-[#5C66F0] text-white px-4 py-2 text-sm font-medium shadow hover:opacity-95 disabled:opacity-60"
            >
              {submitting ? 'Sending...' : 'Send message'}
            </button>

            <button
              type="button"
              onClick={() => { setForm({ name: "", email: "", orderNumber: "", subject: "", message: "" }); setErrors({}); setSuccess(null); setServerError(null); }}
              className="text-sm underline"
            >
              Reset
            </button>

            <div className="ml-auto text-sm text-[#5C66F0]/80">
              <span className="inline-flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Response time: <strong className="ml-1">within 24 hours</strong>
              </span>
            </div>
          </div>

          <div className="mt-4">
            {success && (
              <div className="inline-flex items-start gap-2 rounded-md bg-green-50 border border-green-100 p-3 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <div>
                  <p className="text-sm font-medium">{success}</p>
                </div>
              </div>
            )}

            {serverError && (
              <div className="inline-flex items-start gap-2 rounded-md bg-red-50 border border-red-100 p-3 text-red-700">
                <XCircle className="w-5 h-5" />
                <div>
                  <p className="text-sm font-medium">{serverError}</p>
                </div>
              </div>
            )}
          </div>
        </form>
      </section>

      <section className="mt-12 rounded-2xl border p-6 bg-white shadow-sm">
        <h2 className="text-lg font-medium">Other ways to reach us</h2>
        <p className="mt-2 text-sm text-[#5C66F0]/80">Prefer phone or live chat? Use the channels below.</p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <a className="flex items-start gap-3 p-4 rounded-lg border border-[#5C66F0] hover:shadow-sm" href="tel:+923001234567">
            <Phone className="w-6 h-6 text-[#5C66F0]" />
            <div>
              <p className="font-medium">Call us</p>
              <p className="text-sm text-[#5C66F0]/80">+92 300 1234567</p>
            </div>
          </a>

          <a className="flex items-start gap-3 p-4 rounded-lg border border-[#5C66F0] hover:shadow-sm" href="mailto:support@yourecommercesite.com">
            <Mail className="w-6 h-6 text-[#5C66F0]" />
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-[#5C66F0]/80">support@yourecommercesite.com</p>
            </div>
          </a>

          <a className="flex items-start gap-3 p-4 rounded-lg border border-[#5C66F0] hover:shadow-sm" href="/live-chat">
            <MapPin className="w-6 h-6 text-[#5C66F0]" />
            <div>
              <p className="font-medium">Live chat</p>
              <p className="text-sm text-[#5C66F0]/80">Available during business hours</p>
            </div>
          </a>
        </div>
      </section>
    </main>
    <Footer/>
    </div>
  );
}
