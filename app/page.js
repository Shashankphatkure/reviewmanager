"use client";

import { useState, useEffect } from "react";

const StarRating = ({
  rating,
  setRating,
  size = "text-2xl",
  disabled = false,
}) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => !disabled && setRating(star)}
          className={`${size} focus:outline-none transition-all duration-300 transform hover:scale-110 ${
            disabled ? "cursor-default" : "cursor-pointer"
          }`}
        >
          <span
            className={`star ${
              rating >= star ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
};

export default function ReviewForm() {
  const [qualityRating, setQualityRating] = useState(0);
  const [quantityRating, setQuantityRating] = useState(0);
  const [hygieneRating, setHygieneRating] = useState(0);
  const [overallRating, setOverallRating] = useState(0);
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (qualityRating && quantityRating && hygieneRating) {
      const calculatedOverall = (
        (qualityRating + quantityRating + hygieneRating) /
        3
      ).toFixed(1);
      setOverallRating(parseFloat(calculatedOverall));
    }
  }, [qualityRating, quantityRating, hygieneRating]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (overallRating > 3) {
      setShowThankYou(true);
      setTimeout(() => {
        window.location.href =
          "https://www.google.com/search?q=zudio+kharghar&rlz=1C1YTUH_enIN1096IN1096&oq=zudio+kharghar&gs_lcrp=EgZjaHJvbWUqDggAEEUYJxg7GIAEGIoFMg4IABBFGCcYOxiABBiKBTIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDINCAUQLhivARjHARiABDIHCAYQABiABDIGCAcQRRg80gEIMTE4NGowajeoAgCwAgA&sourceid=chrome&ie=UTF-8&lqi=Cg56dWRpbyBraGFyZ2hhckjW7KyBxreAgAhaHBAAGAAYASIOenVkaW8ga2hhcmdoYXIqBAgCEACSAQ5jbG90aGluZ19zdG9yZZoBJENoZERTVWhOTUc5blMwVkpRMEZuU1VSS2JtRkRTVGhSUlJBQqoBNhABMh4QASIa2lX0AFiP_j_2oW5N4P5jHnx8lAkgrgdc-BQyEhACIg56dWRpbyBraGFyZ2hhcg#lkt=LocalPoiReviews&lrd=0x3be7c3bbdc220ad3:0x95398469f5fdc08f,3,,,,&rlimm=10752771175957250191";
      }, 3000);
    } else {
      setShowReviewForm(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full space-y-6 transform transition-all duration-500 hover:scale-105">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Your Review Matters!
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-lg font-medium text-gray-700">
                Quality:
              </label>
              <StarRating rating={qualityRating} setRating={setQualityRating} />
            </div>
            <div className="flex justify-between items-center">
              <label className="text-lg font-medium text-gray-700">
                Quantity:
              </label>
              <StarRating
                rating={quantityRating}
                setRating={setQuantityRating}
              />
            </div>
            <div className="flex justify-between items-center">
              <label className="text-lg font-medium text-gray-700">
                Hygiene:
              </label>
              <StarRating rating={hygieneRating} setRating={setHygieneRating} />
            </div>
          </div>

          {overallRating > 0 && (
            <div className="flex items-center space-x-4 bg-indigo-100 p-4 rounded-lg animate-fade-in">
              <StarRating
                rating={Math.round(overallRating)}
                setRating={() => {}}
                size="text-4xl"
                disabled={true}
              />
              <span className="text-2xl font-bold text-indigo-600">
                {overallRating.toFixed(1)}
              </span>
            </div>
          )}

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300"
          >
            Submit Review
          </button>
        </form>

        {showThankYou && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg text-center animate-bounce">
              <h3 className="text-2xl font-bold text-indigo-600 mb-4">
                Thank you!
              </h3>
              <p className="text-lg">Please review us on Google</p>
            </div>
          </div>
        )}

        {showReviewForm && (
          <div className="mt-6 space-y-4 animate-fade-in">
            <textarea
              placeholder="Your detailed review..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
              required
            ></textarea>
            <button
              onClick={() => alert("Review submitted successfully!")}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-300"
            >
              Submit Detailed Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
