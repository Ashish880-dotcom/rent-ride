"use client";

import Link from "next/link";
import { useState } from "react";

const contactInfo = [
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
    title: "Phone",
    details: ["+977 9841234567", "+977 9851234568"],
    description: "Mon-Sun, 24/7 Available",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Email",
    details: ["info@rentride.com", "support@rentride.com"],
    description: "We'll respond within 24 hours",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    title: "Office",
    details: ["Thamel, Kathmandu", "Nepal - 44600"],
    description: "Visit us Mon-Fri, 9AM-6PM",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Working Hours",
    details: ["24/7 Customer Support", "Office: 9AM - 6PM"],
    description: "Always here to help you",
  },
];

const team = [
  {
    name: "Shyam Gautam",
    role: "Founder & CEO",
    email: "shyam.gautam@rentride.com",
    phone: "+977 9841234567",
    image: "/team/shyam-gautam.jpg",
  },
  {
    name: "Koshish Thapa",
    role: "Head of Operations",
    email: "koshish.thapa@rentride.com",
    phone: "+977 9851234568",
    image: "/team/koshish-thapa.jpg",
  },
  {
    name: "Ashish Chaudhary",
    role: "Lead Developer & Technology Director",
    email: "ashish.chaudhary@rentride.com",
    phone: "+977 9861234569",
    image: "/team/ashish-chaudhary.jpg",
  },
];

const faqs = [
  {
    question: "How do I book a vehicle?",
    answer:
      "Simply browse our fleet, select your desired vehicle, choose your dates, and complete the booking process. You'll receive instant confirmation via email.",
  },
  {
    question: "What documents do I need?",
    answer:
      "You'll need a valid driver's license, government-issued ID, and a credit/debit card for payment. For international customers, an international driving permit may be required.",
  },
  {
    question: "Can I cancel or modify my booking?",
    answer:
      "Yes, you can cancel or modify your booking up to 24 hours before pickup for a full refund. Cancellations within 24 hours may incur a fee.",
  },
  {
    question: "Is insurance included?",
    answer:
      "Yes, all our vehicles come with comprehensive insurance coverage. Additional coverage options are available at checkout.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert("Thank you for contacting us! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Navigation */}
      <nav className="bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-neutral-900"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              RentRide
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/vehicles"
              className="text-neutral-300 hover:text-white transition-colors text-sm tracking-wide uppercase font-medium"
            >
              Vehicles
            </Link>
            <Link
              href="/services"
              className="text-neutral-300 hover:text-white transition-colors text-sm tracking-wide uppercase font-medium"
            >
              Services
            </Link>
            <Link
              href="/about"
              className="text-neutral-300 hover:text-white transition-colors text-sm tracking-wide uppercase font-medium"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-amber-500 transition-colors text-sm tracking-wide uppercase font-medium"
            >
              Contact
            </Link>
            <Link
              href="/login"
              className="text-neutral-300 hover:text-white transition-colors text-sm tracking-wide uppercase font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              className="text-neutral-300 hover:text-white transition-colors text-sm tracking-wide uppercase font-medium"
            >
              Sign In
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/register"
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-neutral-900 font-bold text-sm tracking-wide uppercase transition-colors rounded"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
          Get In Touch
        </h1>
        <p className="text-neutral-400 text-lg max-w-3xl mx-auto">
          Have questions? We'd love to hear from you. Send us a message and
          we'll respond as soon as possible.
        </p>
      </div>

      {/* Contact Info Cards */}
      <div className="px-6 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 hover:border-amber-600 transition-colors"
            >
              <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center text-amber-500 mb-4">
                {info.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-3">
                {info.title}
              </h3>
              {info.details.map((detail, idx) => (
                <p key={idx} className="text-neutral-300 mb-1">
                  {detail}
                </p>
              ))}
              <p className="text-neutral-500 text-sm mt-2">
                {info.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form & Map */}
      <div className="px-6 pb-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-neutral-300 text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-600 transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-neutral-300 text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-600 transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-neutral-300 text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-600 transition-colors"
                  placeholder="+977 9841234567"
                />
              </div>

              <div>
                <label className="block text-neutral-300 text-sm font-medium mb-2">
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-600 transition-colors"
                >
                  <option value="">Select a subject</option>
                  <option value="booking">Booking Inquiry</option>
                  <option value="support">Customer Support</option>
                  <option value="partnership">Partnership</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 text-sm font-medium mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-600 transition-colors resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-500 text-neutral-900 font-bold py-3 px-6 rounded-lg transition-colors uppercase tracking-wide"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Map & Additional Info */}
          <div className="space-y-6">
            {/* Map */}
            <div className="bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.1234567890!2d85.3094!3d27.7172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQzJzAyLjAiTiA4NcKwMTgnMzMuOCJF!5e0!3m2!1sen!2snp!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>

            {/* Team Contact Cards */}
            <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
              <h3 className="text-white font-bold text-lg mb-4">
                Direct Contact
              </h3>
              <div className="space-y-4">
                {team.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 pb-4 border-b border-neutral-700 last:border-0 last:pb-0"
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">
                        {member.name}
                      </h4>
                      <p className="text-amber-500 text-sm mb-1">
                        {member.role}
                      </p>
                      <p className="text-neutral-400 text-xs">{member.email}</p>
                      <p className="text-neutral-400 text-xs">{member.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
              <h3 className="text-white font-bold text-lg mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-neutral-700 hover:bg-amber-600 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-neutral-700 hover:bg-amber-600 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-neutral-700 hover:bg-amber-600 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-neutral-700 hover:bg-amber-600 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="px-6 py-16 bg-neutral-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-neutral-400 text-lg">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-neutral-800 border border-neutral-700 rounded-lg p-6"
              >
                <h3 className="text-white font-bold text-lg mb-2">
                  {faq.question}
                </h3>
                <p className="text-neutral-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            Ready to Hit the Road?
          </h2>
          <p className="text-neutral-400 text-lg mb-8">
            Browse our premium fleet and book your perfect ride today
          </p>
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-500 text-neutral-900 font-bold text-sm tracking-wide uppercase transition-colors rounded"
          >
            Browse Vehicles
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
