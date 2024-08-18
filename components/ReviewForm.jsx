"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

const ReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [isHovering, setIsHovering] = useState(0);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating >= 4) {
      // Redirect to Google search results page for Zudio Kharghar
      const googleSearchUrl =
        "https://search.google.com/local/writereview?placeid=ChIJywjU6WG_woAR3NrWwrEH_3M";
      window.open(googleSearchUrl, "_blank");
    } else {
      // Submit to internal review system
      try {
        const response = await fetch("/api/submit-review", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rating, description }),
        });

        if (response.ok) {
          alert("Thank you for your review!");
          setRating(0);
          setDescription("");
        } else {
          alert("There was an error submitting your review. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting review:", error);
        alert("There was an error submitting your review. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Share Your Experience
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            How would you rate your experience?
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={32}
                onClick={() => setRating(star)}
                onMouseEnter={() => setIsHovering(star)}
                onMouseLeave={() => setIsHovering(0)}
                className={`cursor-pointer transition-colors duration-200 ${
                  star <= (isHovering || rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
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
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
