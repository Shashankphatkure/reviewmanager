"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash,
  ExternalLink,
  MessageSquare,
  Mail,
  BarChart,
  PieChart,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ReviewsManagerPage = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedRating, setSelectedRating] = useState(0);
  const [showReplies, setShowReplies] = useState({});
  const [replyText, setReplyText] = useState({});
  const [editingReview, setEditingReview] = useState(null);
  const [bulkActionReviews, setBulkActionReviews] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });

  useEffect(() => {
    // Fetch reviews from API (mocked for this example)
    const fetchedReviews = [
      {
        id: 1,
        author: "John Doe",
        rating: 4,
        comment: "Great service!",
        date: "2023-08-15",
        platform: "Google",
        replied: false,
      },
      {
        id: 2,
        author: "Jane Smith",
        rating: 5,
        comment: "Excellent quality!",
        date: "2023-08-14",
        platform: "Yelp",
        replied: true,
      },
      {
        id: 3,
        author: "Bob Johnson",
        rating: 3,
        comment: "Average experience.",
        date: "2023-08-13",
        platform: "Facebook",
        replied: false,
      },
      {
        id: 4,
        author: "Alice Brown",
        rating: 2,
        comment: "Could be better.",
        date: "2023-08-12",
        platform: "TripAdvisor",
        replied: false,
      },
      {
        id: 5,
        author: "Charlie Davis",
        rating: 5,
        comment: "Outstanding!",
        date: "2023-08-11",
        platform: "Google",
        replied: true,
      },
    ];
    setReviews(fetchedReviews);
    setFilteredReviews(fetchedReviews);
    updateStats(fetchedReviews);
  }, []);

  useEffect(() => {
    filterAndSortReviews();
  }, [searchTerm, sortBy, sortOrder, selectedRating, reviews]);

  const updateStats = (reviewsData) => {
    const totalReviews = reviewsData.length;
    const averageRating =
      reviewsData.reduce((sum, review) => sum + review.rating, 0) /
      totalReviews;
    const ratingDistribution = reviewsData.reduce(
      (dist, review) => {
        dist[review.rating] = (dist[review.rating] || 0) + 1;
        return dist;
      },
      { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    );

    setStats({ totalReviews, averageRating, ratingDistribution });
  };

  const filterAndSortReviews = () => {
    let filtered = [...reviews];

    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRating > 0) {
      filtered = filtered.filter((review) => review.rating === selectedRating);
    }

    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else if (sortBy === "rating") {
        return sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating;
      }
      return 0;
    });

    setFilteredReviews(filtered);
  };

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("desc");
    }
  };

  const handleReply = (id) => {
    if (replyText[id]) {
      // Send reply to API (mocked for this example)
      console.log(`Replying to review ${id}: ${replyText[id]}`);
      setReviews(
        reviews.map((review) =>
          review.id === id ? { ...review, replied: true } : review
        )
      );
      setReplyText({ ...replyText, [id]: "" });
      setShowReplies({ ...showReplies, [id]: false });
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      setReviews(reviews.filter((review) => review.id !== id));
      updateStats(reviews.filter((review) => review.id !== id));
    }
  };

  const handleBulkAction = (action) => {
    if (
      action === "delete" &&
      window.confirm("Are you sure you want to delete the selected reviews?")
    ) {
      setReviews(
        reviews.filter((review) => !bulkActionReviews.includes(review.id))
      );
      updateStats(
        reviews.filter((review) => !bulkActionReviews.includes(review.id))
      );
    }
    setBulkActionReviews([]);
    setShowBulkActions(false);
  };

  const ReviewCard = ({ review }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {review.author}
          </h3>
          <div className="flex items-center mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={18}
                className={
                  star <= review.rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">{review.date}</span>
          </div>
        </div>
        <div className="flex items-center">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              review.platform === "Google"
                ? "bg-blue-100 text-blue-800"
                : review.platform === "Yelp"
                ? "bg-red-100 text-red-800"
                : review.platform === "Facebook"
                ? "bg-indigo-100 text-indigo-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {review.platform}
          </span>
        </div>
      </div>
      <p className="mt-3 text-gray-700">{review.comment}</p>
      <div className="mt-4 flex justify-between items-center">
        <div>
          <button
            onClick={() =>
              setShowReplies({
                ...showReplies,
                [review.id]: !showReplies[review.id],
              })
            }
            className="text-blue-600 hover:text-blue-800 mr-4 flex items-center"
          >
            <MessageSquare size={16} className="mr-1" />
            {review.replied ? "View Reply" : "Reply"}
          </button>
          <button
            onClick={() => handleEdit(review)}
            className="text-green-600 hover:text-green-800 mr-4"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(review.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash size={16} />
          </button>
        </div>
        <a
          href="#"
          className="text-gray-600 hover:text-gray-800"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink size={16} />
        </a>
      </div>
      {showReplies[review.id] && (
        <div className="mt-4">
          <textarea
            value={replyText[review.id] || ""}
            onChange={(e) =>
              setReplyText({ ...replyText, [review.id]: e.target.value })
            }
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type your reply here..."
          />
          <button
            onClick={() => handleReply(review.id)}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
          >
            Send Reply
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          Reviews Manager
        </h1>

        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Review Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-600 font-semibold mb-2">Total Reviews</p>
              <p className="text-3xl font-bold text-blue-800">
                {stats.totalReviews}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-600 font-semibold mb-2">
                Average Rating
              </p>
              <p className="text-3xl font-bold text-green-800">
                {stats.averageRating.toFixed(1)}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-600 font-semibold mb-2">
                Rating Distribution
              </p>
              <div className="flex items-center justify-between">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex flex-col items-center">
                    <Star
                      size={20}
                      className="text-yellow-400 fill-yellow-400 mb-1"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      {stats.ratingDistribution[rating]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Filter size={20} className="text-gray-400 mr-2" />
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(Number(e.target.value))}
                className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={0}>All Ratings</option>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} Stars
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <Search size={20} className="text-gray-400 mr-2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search reviews..."
                className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Reviews</h2>
            <div className="flex items-center">
              <button
                onClick={() => handleSort("date")}
                className="mr-4 flex items-center text-gray-600 hover:text-gray-800"
              >
                Date
                {sortBy === "date" &&
                  (sortOrder === "asc" ? (
                    <ChevronUp size={16} className="ml-1" />
                  ) : (
                    <ChevronDown size={16} className="ml-1" />
                  ))}
              </button>
              <button
                onClick={() => handleSort("rating")}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                Rating
                {sortBy === "rating" &&
                  (sortOrder === "asc" ? (
                    <ChevronUp size={16} className="ml-1" />
                  ) : (
                    <ChevronDown size={16} className="ml-1" />
                  ))}
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {bulkActionReviews.length > 0 && (
            <div className="mb-6">
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
              >
                Bulk Actions ({bulkActionReviews.length})
              </button>
              {showBulkActions && (
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => handleBulkAction("delete")}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300 flex items-center"
                  >
                    <Trash size={16} className="mr-2" />
                    Delete Selected
                  </button>
                  <button
                    onClick={() => handleBulkAction("export")}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300 flex items-center"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    Export Selected
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Reviews List */}
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* Edit Review Modal */}
        {editingReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Edit Review
              </h2>
              <input
                type="text"
                value={editingReview.author}
                onChange={(e) =>
                  setEditingReview({ ...editingReview, author: e.target.value })
                }
                className="w-full border rounded-md p-2 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Author name"
              />
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    onClick={() =>
                      setEditingReview({ ...editingReview, rating: star })
                    }
                    className={`cursor-pointer ${
                      star <= editingReview.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <textarea
                value={editingReview.comment}
                onChange={(e) =>
                  setEditingReview({
                    ...editingReview,
                    comment: e.target.value,
                  })
                }
                className="w-full border rounded-md p-2 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                placeholder="Review comment"
              />
              <input
                type="date"
                value={editingReview.date}
                onChange={(e) =>
                  setEditingReview({ ...editingReview, date: e.target.value })
                }
                className="w-full border rounded-md p-2 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={editingReview.platform}
                onChange={(e) =>
                  setEditingReview({
                    ...editingReview,
                    platform: e.target.value,
                  })
                }
                className="w-full border rounded-md p-2 mb-6 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Google">Google</option>
                <option value="Yelp">Yelp</option>
                <option value="Facebook">Facebook</option>
                <option value="TripAdvisor">TripAdvisor</option>
              </select>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setEditingReview(null)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Implement the logic to save the edited review
                    setReviews(
                      reviews.map((review) =>
                        review.id === editingReview.id ? editingReview : review
                      )
                    );
                    setEditingReview(null);
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsManagerPage;
