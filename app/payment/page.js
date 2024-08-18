"use client";

import React, { useState } from "react";
import { Check, X, ChevronDown, ChevronUp, Plus, Minus } from "lucide-react";

const CheckoutModal = ({ isOpen, onClose, isYearly, addons }) => {
  const [selectedAddons, setSelectedAddons] = useState({});
  const basePrice = isYearly ? 600 : 100;

  const toggleAddon = (addonName) => {
    setSelectedAddons((prev) => ({
      ...prev,
      [addonName]: !prev[addonName],
    }));
  };

  const calculateTotal = () => {
    const addonsCost = Object.entries(selectedAddons).reduce(
      (total, [name, isSelected]) => {
        if (isSelected) {
          const addon = addons.find((a) => a.name === name);
          return total + (addon ? addon.price : 0);
        }
        return total;
      },
      0
    );
    return basePrice + addonsCost;
  };

  const handlePayment = () => {
    const total = calculateTotal();
    const upiLink = `upi://pay?pa=shashankphatkure-2@okicici&pn=ShashankPhatkure&am=${total}&cu=INR&tn=SubscriptionPayment`;
    window.location.href = upiLink;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="mb-4">
          <p className="text-lg font-semibold">
            {isYearly ? "Yearly" : "Monthly"} Plan: ₹{basePrice}
          </p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Add-ons:</h3>
          {addons.map((addon) => (
            <div
              key={addon.name}
              className="flex items-center justify-between mb-2"
            >
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedAddons[addon.name] || false}
                  onChange={() => toggleAddon(addon.name)}
                  className="mr-2"
                />
                {addon.name} (₹{addon.price} {addon.unit})
              </label>
              <button
                onClick={() => toggleAddon(addon.name)}
                className={`p-1 rounded-full ${
                  selectedAddons[addon.name]
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {selectedAddons[addon.name] ? (
                  <Minus size={16} />
                ) : (
                  <Plus size={16} />
                )}
              </button>
            </div>
          ))}
        </div>
        <div className="mt-6 border-t pt-4">
          <p className="text-xl font-bold">Total: ₹{calculateTotal()}</p>
        </div>
        <button
          onClick={handlePayment}
          className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

const SubscriptionPage = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const plans = [
    {
      name: "Basic Plan",
      features: [
        "Review Management Panel",
        "Bulk SMS (Pay as you go)",
        "Bulk WhatsApp (Pay as you go)",
        "Bulk Email (Pay as you go)",
      ],
      monthlyPrice: 100,
      yearlyPrice: 600,
    },
  ];

  const addons = [
    { name: "Bulk SMS", price: 1, unit: "per SMS" },
    { name: "Bulk Email", price: 2, unit: "per email" },
    { name: "Bulk WhatsApp", price: 2, unit: "per message" },
  ];

  const faqs = [
    {
      question: "What is included in the basic plan?",
      answer:
        "The basic plan includes access to our Review Management Panel, along with pay-as-you-go options for Bulk SMS, Bulk WhatsApp, and Bulk Email services.",
    },
    {
      question: "How does the yearly pricing work?",
      answer:
        "Our yearly plan offers a significant discount compared to the monthly plan. You pay ₹600 for a full year of service, which is equivalent to 6 months of the monthly plan.",
    },
    {
      question: "Can I change my plan later?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. The changes will be reflected in your next billing cycle.",
    },
    {
      question: "How do the add-ons work?",
      answer:
        "Add-ons like Bulk SMS, Email, and WhatsApp are charged on a per-use basis. You only pay for what you use, with no minimum commitment.",
    },
  ];

  const brands = ["Brand 1", "Brand 2", "Brand 3", "Brand 4", "Brand 5"];

  const testimonials = [
    {
      name: "John Doe",
      company: "Tech Solutions Inc.",
      comment:
        "This service has revolutionized how we manage our customer reviews. Highly recommended!",
    },
    {
      name: "Jane Smith",
      company: "Retail Giants",
      comment:
        "The bulk messaging features have significantly improved our customer engagement. Great value for money!",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Choose Your Plan
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Supercharge your business communication with our comprehensive tools
          </p>
        </div>

        {/* Pricing Toggle */}
        <div className="mt-12 sm:mt-16 sm:flex sm:justify-center">
          <div className="relative bg-white rounded-lg p-0.5 flex sm:mt-0">
            <button
              type="button"
              className={`${
                !isYearly ? "bg-indigo-500 text-white" : "text-gray-500"
              } relative w-1/2 rounded-md py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10 sm:w-auto sm:px-8`}
              onClick={() => setIsYearly(false)}
            >
              Monthly billing
            </button>
            <button
              type="button"
              className={`${
                isYearly ? "bg-indigo-500 text-white" : "text-gray-500"
              } ml-0.5 relative w-1/2 rounded-md py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10 sm:w-auto sm:px-8`}
              onClick={() => setIsYearly(true)}
            >
              Yearly billing
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-1 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white"
            >
              <div className="p-6">
                <h2 className="text-2xl leading-6 font-semibold text-gray-900">
                  {plan.name}
                </h2>
                <p className="mt-4 text-sm text-gray-500">{plan.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ₹{isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    /{isYearly ? "year" : "month"}
                  </span>
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center mt-5 px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Get started
                </button>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
                  What's included
                </h3>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex space-x-3">
                      <Check
                        className="flex-shrink-0 h-5 w-5 text-green-500"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Checkout Modal */}
              <CheckoutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                isYearly={isYearly}
                addons={addons}
              />
            </div>
          ))}
        </div>

        {/* Add-ons */}
        <div className="mt-16">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            Add-ons
          </h2>
          <div className="mt-6 bg-white rounded-lg shadow overflow-hidden divide-y divide-gray-200">
            {addons.map((addon) => (
              <div key={addon.name} className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {addon.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Pay only for what you use
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-gray-900">
                      ₹{addon.price}
                    </p>
                    <p className="text-sm text-gray-500">{addon.unit}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-16">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            Frequently Asked Questions
          </h2>
          <div className="mt-6 space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <button
                  className="w-full px-4 py-5 sm:p-6 text-left focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {faq.question}
                    </h3>
                    {openFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-5 sm:px-6 sm:pb-6">
                    <p className="text-base text-gray-500">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div className="mt-16">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            Trusted by Leading Brands
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-5">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="col-span-1 flex justify-center items-center"
              >
                <img
                  className="h-12"
                  src={`/api/placeholder/150/50?text=${encodeURIComponent(
                    brand
                  )}`}
                  alt={brand}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            What Our Customers Say
          </h2>
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="px-4 py-5 sm:p-6">
                  <p className="text-base text-gray-500 italic">
                    "{testimonial.comment}"
                  </p>
                  <div className="mt-4">
                    <p className="text-base font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Ready to supercharge your business?
          </h2>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Get started
              </a>
            </div>
            <div className="ml-3 inline-flex">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
