"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { Star, CreditCard } from "lucide-react";
import ShimmerEffect from "@/components/ShimmerEffect";

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
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [ratingFactor1Value, setRatingFactor1Value] = useState(0);
  const [ratingFactor2Value, setRatingFactor2Value] = useState(0);
  const [ratingFactor3Value, setRatingFactor3Value] = useState(0);

  // Add default rating factors
  const defaultRatingFactors = {
    rating_factor_1: "Quality",
    rating_factor_2: "Service",
    rating_factor_3: "Value for Money",
  };

  useEffect(() => {
    fetchBusinessDetails();
  }, [params.id]);

  useEffect(() => {
    const newOverallRating = Math.round(
      (ratingFactor1Value + ratingFactor2Value + ratingFactor3Value) / 3
    );
    setOverallRating(newOverallRating);

    if (newOverallRating >= 4) {
      redirectToGoogleReview();
    }
  }, [ratingFactor1Value, ratingFactor2Value, ratingFactor3Value]);

  const fetchBusinessDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) throw error;

      // Merge default rating factors with business data
      const businessWithDefaults = {
        ...data,
        rating_factor_1:
          data.rating_factor_1 || defaultRatingFactors.rating_factor_1,
        rating_factor_2:
          data.rating_factor_2 || defaultRatingFactors.rating_factor_2,
        rating_factor_3:
          data.rating_factor_3 || defaultRatingFactors.rating_factor_3,
      };

      setBusiness(businessWithDefaults);
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
          rating_factor_1: ratingFactor1Value,
          rating_factor_2: ratingFactor2Value,
          rating_factor_3: ratingFactor3Value,
          description,
          businessId: business.id,
        }),
      });

      if (response.ok) {
        setShowThankYouModal(true);
        setTimeout(() => {
          setShowThankYouModal(false);
        }, 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error submitting review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(
        error.message ||
          "There was an error submitting your review. Please try again."
      );
    }
  };

  const SubReviewItem = ({ title, rating, setRating }) => {
    if (!title) return null;

    return (
      <div className="mb-4">
        <label className="block text-white text-sm font-semibold mb-2">
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
  };

  if (loading) return <ShimmerEffect />;
  if (error) return <div>Error: {error}</div>;
  if (!business) return <div>Business not found</div>;

  return (
    <div
      className="min-h-screen p-8"
      style={{
        backgroundImage: business?.background_url
          ? `url(${business.background_url})`
          : "linear-gradient(to bottom right, #6b21a8, #818cf8, #93c5fd)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-3xl mx-auto backdrop-blur-md bg-black/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.25)] border border-white/20 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            {business?.logo_url && (
              <div className="w-16 h-16 rounded-full bg-white/70 flex items-center justify-center overflow-hidden">
                <img
                  src={business.logo_url}
                  alt={`${business.name} logo`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/default-logo.png"; // Fallback to default logo
                    e.target.onerror = null; // Prevent infinite loop
                  }}
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {business.name}
              </h1>
              <p className="text-white/90">
                Please leave a review to help us improve
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SubReviewItem
                title={
                  business?.rating_factor_1 ||
                  defaultRatingFactors.rating_factor_1
                }
                rating={ratingFactor1Value}
                setRating={setRatingFactor1Value}
              />
              <SubReviewItem
                title={
                  business?.rating_factor_2 ||
                  defaultRatingFactors.rating_factor_2
                }
                rating={ratingFactor2Value}
                setRating={setRatingFactor2Value}
              />
              <SubReviewItem
                title={
                  business?.rating_factor_3 ||
                  defaultRatingFactors.rating_factor_3
                }
                rating={ratingFactor3Value}
                setRating={setRatingFactor3Value}
              />
            </div>

            <div className="border-t border-white/40 pt-6">
              <h3 className="text-lg font-semibold mb-2 text-center text-white">
                Overall Rating
              </h3>
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
                  <label className="block text-white text-sm font-semibold mb-2">
                    Tell us more about your experience
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 text-white bg-white/10 backdrop-blur-xl border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 placeholder-gray-300 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] transition-all duration-300 hover:bg-white/20"
                    rows="4"
                    required
                    placeholder="Your feedback helps us improve..."
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 text-white bg-white/10 backdrop-blur-xl border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 placeholder-gray-300 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] transition-all duration-300 hover:bg-white/20"
                      required
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-4 py-3 text-white bg-white/10 backdrop-blur-xl border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 placeholder-gray-300 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] transition-all duration-300 hover:bg-white/20"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 text-white bg-white/10 backdrop-blur-xl border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 placeholder-gray-300 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] transition-all duration-300 hover:bg-white/20"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-500/70 hover:bg-blue-600/70 backdrop-blur-xl text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-400/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.2)] border border-white/20 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.4)]"
                  >
                    Submit Review
                  </button>
                </div>
              </>
            )}
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 py-1 bg-white/20 backdrop-blur-xl text-white rounded-full border border-white/40">
                  OR
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() =>
                  window.open(
                    `upi://pay?pa=${business.upi_id}&pn=${business.name}&cu=INR`,
                    "_blank"
                  )
                }
                className="w-full bg-green-500/70 hover:bg-green-600/70 backdrop-blur-xl text-white px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-400/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.2)] border border-white/20 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.4)]"
              >
                <CreditCard className="mr-2" size={20} />
                Pay via UPI
              </button>
            </div>
          </div>
        </div>
      </div>
      {showThankYouModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-2xl p-8 shadow-xl max-w-md mx-4 transform animate-fadeIn">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Thank You!
              </h3>
              <p className="text-sm text-gray-500">
                Your feedback is invaluable to us. We appreciate you taking the
                time to share your experience.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessPage;
