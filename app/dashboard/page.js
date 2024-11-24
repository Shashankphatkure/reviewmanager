"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import {
  Star,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  LogOut,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import QRCode from "qrcode.react";

const DashboardPage = () => {
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [upiId, setUpiId] = useState("");
  const [placeId, setPlaceId] = useState("");
  const [editingService, setEditingService] = useState(null);
  const [newService, setNewService] = useState({ name: "", price: "" });
  const [bulkEmailContent, setBulkEmailContent] = useState("");
  const [bulkSmsContent, setBulkSmsContent] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedStars, setSelectedStars] = useState([]);
  const [business, setBusiness] = useState(null);
  const [ratingFactor1, setRatingFactor1] = useState("");
  const [ratingFactor2, setRatingFactor2] = useState("");
  const [ratingFactor3, setRatingFactor3] = useState("");
  const [logo, setLogo] = useState(null);
  const [background, setBackground] = useState(null);

  useEffect(() => {
    fetchBusinessDetails();
  }, []);

  useEffect(() => {
    if (business) {
      fetchReviews();
    }
  }, [business]);

  useEffect(() => {
    if (business) {
      fetchServices();
    }
  }, [business]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("businessid", business.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("businessid", business.id)
        .order("created_at", { ascending: false })
        .limit(10); // Limit to the 10 most recent reviews

      if (error) throw error;
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const fetchBusinessDetails = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setBusiness(data);
      setUpiId(data.upi_id || "");
      setPlaceId(data.places_id || "");
      setRatingFactor1(data.rating_factor_1 || "");
      setRatingFactor2(data.rating_factor_2 || "");
      setRatingFactor3(data.rating_factor_3 || "");
    } catch (error) {
      console.error("Error fetching business details:", error);
    }
  };

  const handleLogout = () => {
    console.log("Logging out...");
    router.push("/signup");
  };

  const handleBulkSms = () => {
    console.log("Sending bulk SMS:", bulkSmsContent);
    setBulkSmsContent("");
  };

  const handleBulkEmail = () => {
    console.log("Sending bulk email:", {
      subject: bulkEmailSubject,
      content: bulkEmailContent,
    });
    setBulkEmailSubject("");
    setBulkEmailContent("");
  };

  const handleServiceEdit = (service) => {
    setEditingService({ ...service });
  };

  const handleServiceSave = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .update({ name: editingService.name, price: editingService.price })
        .eq("id", editingService.id);

      if (error) throw error;

      setServices(
        services.map((s) =>
          s.id === editingService.id ? { ...s, ...data[0] } : s
        )
      );
      setEditingService(null);
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  const handleServiceDelete = async (id) => {
    try {
      const { error } = await supabase.from("services").delete().eq("id", id);

      if (error) throw error;

      setServices(services.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const handleAddService = async () => {
    if (newService.name && newService.price && business) {
      try {
        const { data, error } = await supabase
          .from("services")
          .insert([
            {
              name: newService.name,
              price: newService.price,
              businessid: business.id,
            },
          ])
          .select();

        if (error) throw error;

        setServices([...services, data[0]]);
        setNewService({ name: "", price: "" });
      } catch (error) {
        console.error("Error adding service:", error);
      }
    }
  };

  const handleUpiSave = async () => {
    try {
      const { data, error } = await supabase
        .from("businesses")
        .update({ upi_id: upiId })
        .eq("user_id", business.user_id);

      if (error) throw error;
      console.log("UPI ID saved:", upiId);
      setBusiness({ ...business, upi_id: upiId });
    } catch (error) {
      console.error("Error saving UPI ID:", error);
    }
  };

  const handlePlaceIdSave = async () => {
    try {
      const { data, error } = await supabase
        .from("businesses")
        .update({ places_id: placeId })
        .eq("user_id", business.user_id);

      if (error) throw error;
      console.log("Place ID saved:", placeId);
      setBusiness({ ...business, places_id: placeId });
    } catch (error) {
      console.error("Error saving Place ID:", error);
    }
  };

  const handleStarFilter = (star) => {
    if (selectedStars.includes(star)) {
      setSelectedStars(selectedStars.filter((s) => s !== star));
    } else {
      setSelectedStars([...selectedStars, star]);
    }
  };

  const filteredReviews = selectedStars.length
    ? reviews.filter((review) => selectedStars.includes(review.rating))
    : reviews;

  const getReviewBackgroundColor = (rating) => {
    switch (rating) {
      case 1:
        return "bg-red-100";
      case 2:
        return "bg-orange-100";
      case 3:
        return "bg-yellow-100";
      case 4:
        return "bg-green-100";
      case 5:
        return "bg-emerald-100";
      default:
        return "";
    }
  };

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleBackgroundChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBackground(e.target.files[0]);
    }
  };

  const handleLogoSave = async () => {
    if (!logo || !business) return;

    try {
      const fileExt = logo.name.split(".").pop();
      const fileName = `${business.id}/logo.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("business-assets")
        .upload(fileName, logo, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("business-assets").getPublicUrl(fileName);

      const { data: updateData, error: updateError } = await supabase
        .from("businesses")
        .update({ logo_url: publicUrl })
        .eq("id", business.id);

      if (updateError) throw updateError;

      setBusiness({ ...business, logo_url: publicUrl });
      alert("Logo updated successfully!");
    } catch (error) {
      console.error("Error saving logo:", error);
      alert("Failed to update logo");
    }
  };

  const handleBackgroundSave = async () => {
    if (!background || !business) return;

    try {
      const fileExt = background.name.split(".").pop();
      const fileName = `${business.id}/background.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("business-assets")
        .upload(fileName, background, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("business-assets").getPublicUrl(fileName);

      const { data: updateData, error: updateError } = await supabase
        .from("businesses")
        .update({ background_url: publicUrl })
        .eq("id", business.id);

      if (updateError) throw updateError;

      setBusiness({ ...business, background_url: publicUrl });
      alert("Background image updated successfully!");
    } catch (error) {
      console.error("Error saving background:", error);
      alert("Failed to update background image");
    }
  };

  const handleRatingFactorsSave = async () => {
    if (!business) return;

    try {
      const { data, error } = await supabase
        .from("businesses")
        .update({
          rating_factor_1: ratingFactor1,
          rating_factor_2: ratingFactor2,
          rating_factor_3: ratingFactor3,
        })
        .eq("id", business.id);

      if (error) throw error;

      setBusiness({
        ...business,
        rating_factor_1: ratingFactor1,
        rating_factor_2: ratingFactor2,
        rating_factor_3: ratingFactor3,
      });

      alert("Rating factors updated successfully!");
    } catch (error) {
      console.error("Error saving rating factors:", error);
      alert("Failed to update rating factors");
    }
  };

  const imagePreviewSection = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      {business?.logo_url && (
        <div className="p-4 border rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Current Logo
          </h4>
          <img
            src={business.logo_url}
            alt="Business Logo"
            className="max-h-32 object-contain"
          />
        </div>
      )}
      {business?.background_url && (
        <div className="p-4 border rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Current Background
          </h4>
          <img
            src={business.background_url}
            alt="Background Image"
            className="max-h-32 object-cover w-full"
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-800 to-purple-800 tracking-tight flex items-center">
            <span className="bg-indigo-100 p-2 rounded-lg shadow-sm mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-indigo-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </span>
            Store Manager Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-lg hover:from-red-600 hover:to-pink-600 transition duration-300 ease-in-out flex items-center shadow-xl transform hover:scale-105"
          >
            <LogOut size={20} className="mr-3" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>

        {business && (
          <section className="bg-white rounded-2xl shadow-xl p-8 mb-8 transition duration-300 ease-in-out transform hover:scale-105">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold ml-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  {business.name}
                </h2>
              </div>
              <button
                onClick={() => router.push(`/business/${business.id}`)}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition duration-300 ease-in-out shadow-md flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                View My Business
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-indigo-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-indigo-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path
                        fillRule="evenodd"
                        d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-indigo-700">
                    Payment Details
                  </h3>
                </div>
                <p className="text-gray-700 bg-white rounded-lg p-4 shadow-sm">
                  UPI ID:{" "}
                  <span className="font-medium">
                    {business.upi_id || "Not set"}
                  </span>
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-purple-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-purple-700">
                    Google Integration
                  </h3>
                </div>
                <p className="text-gray-700 bg-white rounded-lg p-4 shadow-sm">
                  Places ID:{" "}
                  <span className="font-medium">
                    {business.places_id || "Not set"}
                  </span>
                </p>
              </div>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Reviews Section */}
          <section className="bg-white rounded-2xl shadow-xl p-8 transition duration-300 ease-in-out transform hover:scale-105">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-indigo-700">
                Recent Reviews
              </h2>
              <div className="bg-indigo-100 rounded-full px-4 py-2">
                <span className="text-indigo-700 font-semibold">
                  {reviews.length} Reviews
                </span>
              </div>
            </div>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className={`${getReviewBackgroundColor(
                    review.overall_rating
                  )} rounded-xl p-6 shadow-sm transition duration-200 hover:shadow-md`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-indigo-500 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                        <span className="text-white font-medium">
                          {review.name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-semibold text-lg text-gray-800">
                        {review.name}
                      </span>
                    </div>
                    <div className="flex bg-white rounded-lg px-3 py-1 shadow-sm">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={
                            i < review.overall_rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 bg-white rounded-lg p-4 shadow-sm italic">
                    "{review.description}"
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Services Section */}
          <section className="bg-white rounded-2xl shadow-xl p-8 transition duration-300 ease-in-out transform hover:scale-105">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-indigo-700">Services</h2>
              <div className="bg-indigo-100 rounded-full px-4 py-2">
                <span className="text-indigo-700 font-semibold">
                  {services.length} Services
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-3 gap-4 mb-4 px-4 py-2 bg-indigo-50 rounded-lg">
                <span className="text-sm font-semibold text-indigo-600">
                  Service Name
                </span>
                <span className="text-sm font-semibold text-indigo-600">
                  Price
                </span>
                <span className="text-sm font-semibold text-indigo-600 text-right">
                  Actions
                </span>
              </div>

              <div className="space-y-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="grid grid-cols-3 gap-4 items-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200"
                  >
                    {editingService && editingService.id === service.id ? (
                      <>
                        <input
                          type="text"
                          value={editingService.name}
                          onChange={(e) =>
                            setEditingService({
                              ...editingService,
                              name: e.target.value,
                            })
                          }
                          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                        />
                        <input
                          type="number"
                          value={editingService.price}
                          onChange={(e) =>
                            setEditingService({
                              ...editingService,
                              price: Number(e.target.value),
                            })
                          }
                          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={handleServiceSave}
                            className="bg-green-100 p-2 rounded-lg text-green-600 hover:bg-green-200 transition duration-200"
                          >
                            <Save size={18} />
                          </button>
                          <button
                            onClick={() => setEditingService(null)}
                            className="bg-red-100 p-2 rounded-lg text-red-600 hover:bg-red-200 transition duration-200"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-800 font-medium">
                          {service.name}
                        </span>
                        <span className="text-indigo-600 font-semibold">
                          ₹{service.price}
                        </span>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleServiceEdit(service)}
                            className="bg-blue-100 p-2 rounded-lg text-blue-600 hover:bg-blue-200 transition duration-200"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleServiceDelete(service.id)}
                            className="bg-red-100 p-2 rounded-lg text-red-600 hover:bg-red-200 transition duration-200"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-indigo-700 mb-4">
                Add New Service
              </h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Service name"
                  value={newService.name}
                  onChange={(e) =>
                    setNewService({ ...newService, name: e.target.value })
                  }
                  className="border rounded-lg px-4 py-2 flex-grow focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newService.price}
                  onChange={(e) =>
                    setNewService({ ...newService, price: e.target.value })
                  }
                  className="border rounded-lg px-4 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleAddService}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Customers Section */}
        <section className="bg-white rounded-2xl shadow-xl p-8 my-8 transition duration-300 ease-in-out transform hover:scale-105">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-indigo-700">Customers</h2>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 text-sm">
                {reviews.length} Total Customers
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    Customer Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    Contact Information
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    Last Review
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {reviews.map((review) => (
                  <tr
                    key={review.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                            <User className="h-6 w-6 text-indigo-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {review.name}
                          </div>
                          <div className="flex items-center mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={14}
                                className={`${
                                  star <= review.overall_rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex flex-col">
                        <span className="flex items-center">
                          <Mail size={14} className="mr-2 text-indigo-500" />
                          {review.email}
                        </span>
                        <span className="flex items-center mt-1">
                          <MessageSquare
                            size={14}
                            className="mr-2 text-indigo-500"
                          />
                          {review.phone_number}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {reviews.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No customers yet. Share your review link to get started!
            </div>
          )}
        </section>

        {/* Bulk Communication Section */}
        <section className="bg-white rounded-2xl shadow-xl p-8 my-8 transition duration-300 ease-in-out transform hover:scale-105">
          <h2 className="text-3xl font-bold mb-6 text-indigo-700">
            Bulk Communication
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bulk Email
              </label>
              <textarea
                value={bulkEmailContent}
                onChange={(e) => setBulkEmailContent(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your email content here..."
              ></textarea>
              <button
                onClick={handleBulkEmail}
                className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition duration-300 ease-in-out flex items-center shadow-lg"
              >
                <Mail size={20} className="mr-2" />
                Send Bulk Email
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bulk SMS
              </label>
              <textarea
                value={bulkSmsContent}
                onChange={(e) => setBulkSmsContent(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your SMS content here..."
              ></textarea>
              <button
                onClick={handleBulkSms}
                className="mt-4 bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition duration-300 ease-in-out flex items-center shadow-lg"
              >
                <MessageSquare size={20} className="mr-2" />
                Send Bulk SMS
              </button>
            </div>
          </div>
        </section>

        {/* Settings and QR Code Section */}
        <section className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-2xl p-8 transition duration-300 ease-in-out transform hover:scale-105 border border-indigo-100">
          <div className="flex items-center mb-8">
            <h2 className="text-3xl font-bold text-indigo-700 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Settings and QR Code
            </h2>
            <div className="ml-4 h-1 flex-grow bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Settings Column */}
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
                <h3 className="text-xl font-semibold mb-6 text-indigo-600 flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-indigo-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  Settings
                </h3>

                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors">
                      UPI ID
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="border border-gray-200 rounded-l-lg px-4 py-3 flex-grow focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder="Enter UPI ID"
                      />
                      <button
                        onClick={handleUpiSave}
                        className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-r-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-lg"
                      >
                        Save
                      </button>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors">
                      Google My Business Place ID
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={placeId}
                        onChange={(e) => setPlaceId(e.target.value)}
                        className="border border-gray-200 rounded-l-lg px-4 py-3 flex-grow focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder="Enter Place ID"
                      />
                      <button
                        onClick={handlePlaceIdSave}
                        className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-r-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-lg"
                      >
                        Save
                      </button>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors">
                      Business Logo
                    </label>
                    <div className="flex items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoChange(e)}
                        className="border border-gray-200 rounded-l-lg px-4 py-3 flex-grow focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                      <button
                        onClick={handleLogoSave}
                        className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-r-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-lg"
                      >
                        Upload
                      </button>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors">
                      Background Image
                    </label>
                    <div className="flex items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleBackgroundChange(e)}
                        className="border border-gray-200 rounded-l-lg px-4 py-3 flex-grow focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                      <button
                        onClick={handleBackgroundSave}
                        className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-r-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-lg"
                      >
                        Upload
                      </button>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors">
                      Rating Factors
                    </label>
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={ratingFactor1}
                        onChange={(e) => setRatingFactor1(e.target.value)}
                        className="border border-gray-200 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder="First Rating Factor (e.g. Service Quality)"
                      />
                      <input
                        type="text"
                        value={ratingFactor2}
                        onChange={(e) => setRatingFactor2(e.target.value)}
                        className="border border-gray-200 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder="Second Rating Factor (e.g. Cleanliness)"
                      />
                      <input
                        type="text"
                        value={ratingFactor3}
                        onChange={(e) => setRatingFactor3(e.target.value)}
                        className="border border-gray-200 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder="Third Rating Factor (e.g. Value for Money)"
                      />
                      <button
                        onClick={handleRatingFactorsSave}
                        className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-lg"
                      >
                        Save Rating Factors
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Column */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-indigo-100 flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold mb-6 text-indigo-600 flex items-center">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                Business Review QR Code
              </h3>
              {business && (
                <div className="bg-white p-4 rounded-xl shadow-inner">
                  <QRCode
                    value={`https://reviewmanager.vercel.app/business/${business.id}`}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              )}
              <p className="mt-6 text-sm text-gray-600 bg-indigo-50 px-4 py-2 rounded-full">
                Scan to leave a review for your business
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const getReviewBackgroundColor = (rating) => {
  switch (rating) {
    case 1:
      return "bg-red-100";
    case 2:
      return "bg-orange-100";
    case 3:
      return "bg-yellow-100";
    case 4:
      return "bg-green-100";
    case 5:
      return "bg-emerald-100";
    default:
      return "";
  }
};

export default DashboardPage;
