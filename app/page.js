"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

const SubReviewItem = ({
  title,
  rating,
  setRating,
  isHovering,
  setIsHovering,
}) => (
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
);

const ReviewForm = ({ userName = "" }) => {
  const [overallRating, setOverallRating] = useState(0);
  const [qualityRating, setQualityRating] = useState(0);
  const [quantityRating, setQuantityRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [description, setDescription] = useState("");
  const [name, setName] = useState(userName);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isHovering, setIsHovering] = useState({
    overall: 0,
    quality: 0,
    quantity: 0,
    service: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const newOverallRating = Math.round(
      (qualityRating + quantityRating + serviceRating) / 3
    );
    setOverallRating(newOverallRating);
  }, [qualityRating, quantityRating, serviceRating]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (overallRating >= 4) {
      const googleSearchUrl =
        "https://search.google.com/local/writereview?placeid=ChIJywjU6WG_woAR3NrWwrEH_3M";
      window.open(googleSearchUrl, "_blank");
    } else {
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
          }),
        });

        if (response.ok) {
          alert("Thank you for your review!");
          resetForm();
        } else {
          alert("There was an error submitting your review. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting review:", error);
        alert("There was an error submitting your review. Please try again.");
      }
    }
  };

  const resetForm = () => {
    setOverallRating(0);
    setQualityRating(0);
    setQuantityRating(0);
    setServiceRating(0);
    setDescription("");
    setName(userName);
    setPhoneNumber("");
    setEmail("");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Share Your Experience
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SubReviewItem
            title="Quality"
            rating={qualityRating}
            setRating={setQualityRating}
            isHovering={isHovering.quality}
            setIsHovering={(value) =>
              setIsHovering({ ...isHovering, quality: value })
            }
          />
          <SubReviewItem
            title="Quantity"
            rating={quantityRating}
            setRating={setQuantityRating}
            isHovering={isHovering.quantity}
            setIsHovering={(value) =>
              setIsHovering({ ...isHovering, quantity: value })
            }
          />
          <SubReviewItem
            title="Service"
            rating={serviceRating}
            setRating={setServiceRating}
            isHovering={isHovering.service}
            setIsHovering={(value) =>
              setIsHovering({ ...isHovering, service: value })
            }
          />
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Overall Rating</h3>
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

        {overallRating >= 4 && (
          <>
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
          </>
        )}

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

        <button
          onClick={() =>
            window.open(
              "upi://pay?pn=AtasaResort&pa=atasaresort@icici&cu=INR",
              "_blank"
            )
          }
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Pay online
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
