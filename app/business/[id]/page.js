"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { Star, CreditCard } from "lucide-react";

const BusinessPage = ({ params }) => {
  const router = useRouter();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overallRating, setOverallRating] = useState(0);
  const [qualityRating, setQualityRating] = useState(0);
  const [quantityRating, setQuantityRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchBusinessDetails();
  }, [params.id]);

  useEffect(() => {
    const newOverallRating = Math.round(
      (qualityRating + quantityRating + serviceRating) / 3
    );
    setOverallRating(newOverallRating);

    if (newOverallRating >= 4) {
      redirectToGoogleReview();
    }
  }, [qualityRating, quantityRating, serviceRating]);

  const fetchBusinessDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setBusiness(data);
    } catch (error) {
      console.error("Error fetching business details:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getGoogleReviewLink = (placesId) => {
    return `https://search.google.com/local/writereview?placeid=${placesId}`;
  };

  const redirectToGoogleReview = () => {
    if (business && business.places_id) {
      window.open(getGoogleReviewLink(business.places_id), "_blank");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/submit-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phoneNumber,
          email,
          overallRating,
          qualityRating,
          quantityRating,
          serviceRating,
          description,
          businessId: business.id, // Include the business ID
        }),
      });

      if (response.ok) {
        alert("Thank you for your review!");
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error submitting review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.message || "There was an error submitting your review. Please try again.");
    }
  };

  const SubReviewItem = ({ title, rating, setRating }) => (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-semibold mb-2">
        {title}
      </label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={24}
            onClick={() => setRating(star)}
            className={`cursor-pointer transition-colors duration-200 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!business) return <div>Business not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-teal-200 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-indigo-600 mb-4">{business.name}</h1>
          {/* <p className="text-gray-600 mb-2">UPI ID: {business.upi_id || "Not set"}</p>
          <p className="text-gray-600 mb-4">Google Places ID: {business.places_id || "Not set"}</p>
           */}
                  <p className="text-gray-600 mb-8">Please leave a review to help us improve</p>
                  
                  
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SubReviewItem
                title="Quality"
                rating={qualityRating}
                setRating={setQualityRating}
              />
              <SubReviewItem
                title="Quantity"
                rating={quantityRating}
                setRating={setQuantityRating}
              />
              <SubReviewItem
                title="Service"
                rating={serviceRating}
                setRating={setServiceRating}
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2 text-center">Overall Rating</h3>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={40}
                    className={`transition-colors duration-200 ${
                      star <= overallRating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {overallRating > 0 && overallRating < 4 && (
              <>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Tell us more about your experience
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                    rows="4"
                    required
                    placeholder="Your feedback helps us improve..."
                  />
                </div>

                <div>
                  <label
                    htmlFor="name"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                    required
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                    placeholder="Enter your email address"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Submit Review
                </button>
              </>
            )}
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => window.open(`upi://pay?pa=${business.upi_id}&pn=${business.name}&cu=INR`, "_blank")}
                className="w-full bg-green-500 text-white px-4 py-3 rounded-md hover:bg-green-600 transition duration-300 flex items-center justify-center"
              >
                <CreditCard className="mr-2" size={20} />
                Pay via UPI
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPage;