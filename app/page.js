"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  BarChart2,
  Users,
  MessageSquare,
  Gift,
  Shield,
  Phone,
} from "lucide-react";

const HomePage = () => {
  const router = useRouter();

  const features = [
    {
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      title: "Review Management",
      description:
        "Collect and manage customer reviews efficiently. Automatically redirect happy customers to Google Reviews.",
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-blue-500" />,
      title: "Analytics Dashboard",
      description:
        "Get detailed insights into customer satisfaction and track your business performance over time.",
    },
    {
      icon: <Users className="w-6 h-6 text-green-500" />,
      title: "Customer Database",
      description:
        "Build and maintain a comprehensive database of your customers and their feedback.",
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-purple-500" />,
      title: "Bulk Communication",
      description:
        "Send bulk emails and SMS to engage with your customers and keep them updated.",
    },
    {
      icon: <Gift className="w-6 h-6 text-red-500" />,
      title: "Service Management",
      description:
        "Manage your services and pricing efficiently with an easy-to-use interface.",
    },
    {
      icon: <Shield className="w-6 h-6 text-indigo-500" />,
      title: "Secure Payments",
      description:
        "Accept payments securely through UPI integration and manage transactions.",
    },
  ];

  const testimonials = [
    {
      name: "Ayesha Khan",
      role: "Restaurant Owner",
      content:
        "This platform has transformed how we collect and manage customer feedback. Our Google reviews have increased by 200%!",
      rating: 5,
    },
    {
      name: "Rajesh Kumar",
      role: "Retail Store Manager",
      content:
        "The customer database and bulk communication features have helped us stay connected with our customers effectively.",
      rating: 5,
    },
    {
      name: "Priya Patel",
      role: "Salon Owner",
      content:
        "Easy to use and great customer support. The QR code feature has made it simple for customers to leave reviews. Thank you!",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
              Transform Your Business with Customer Reviews
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Streamline your review collection, manage customer feedback, and
              grow your business with our all-in-one platform.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => (window.location.href = "tel:+917977808166")}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need to Succeed
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Trusted by Business Owners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using our platform to improve their
            customer experience and grow their online presence.
          </p>
          <button
            onClick={() => (window.location.href = "tel:+917977808166")}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Call now: +91 7977808166
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
