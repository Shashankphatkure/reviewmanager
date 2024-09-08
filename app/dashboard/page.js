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

  useEffect(() => {
    fetchBusinessDetails();
  }, []);

  useEffect(() => {
    if (business) {
      fetchReviews();
    }
  }, [business]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
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
        .eq('businessid', business.id)
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setBusiness(data);
      setUpiId(data.upi_id || "");
      setPlaceId(data.places_id || "");
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
    if (newService.name && newService.price) {
      try {
        const { data, error } = await supabase
          .from("services")
          .insert([{ name: newService.name, price: newService.price }])
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
        .from('businesses')
        .update({ upi_id: upiId })
        .eq('user_id', business.user_id);

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
        .from('businesses')
        .update({ places_id: placeId })
        .eq('user_id', business.user_id);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-indigo-800 tracking-tight">
            Store Manager Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition duration-300 ease-in-out flex items-center shadow-lg"
          >
            <LogOut size={20} className="mr-2" />
            Logout
          </button>
        </div>

        {business && (
          <section className="bg-white rounded-2xl shadow-xl p-8 mb-8 transition duration-300 ease-in-out transform hover:scale-105">
            <h2 className="text-3xl font-bold mb-4 text-indigo-700">
              Your Business
            </h2>
            <p className="text-xl text-gray-700 mb-2">
              Name: {business.name}
            </p>
            <p className="text-gray-600 mb-2">
              UPI ID: {business.upi_id || "Not set"}
            </p>
            <p className="text-gray-600 mb-4">
              Google Places ID: {business.places_id || "Not set"}
            </p>
            <button
              onClick={() => router.push(`/business/${business.id}`)}
              className="bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 transition duration-300 ease-in-out"
            >
              Manage Business
            </button>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Reviews Section */}
          <section className="bg-white rounded-2xl shadow-xl p-8 transition duration-300 ease-in-out transform hover:scale-105">
            <h2 className="text-3xl font-bold mb-6 text-indigo-700">
              Recent Reviews
            </h2>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div 
                  key={review.id} 
                  className={`border-b border-gray-200 pb-4 ${getReviewBackgroundColor(review.overall_rating)}`}
                >
                  <div className="flex items-center mb-2">
                    <span className="font-semibold mr-2 text-gray-800">
                      {review.name}
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={
                            i < review.overall_rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 italic">{review.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Services Section */}
          <section className="bg-white rounded-2xl shadow-xl p-8 transition duration-300 ease-in-out transform hover:scale-105">
            <h2 className="text-3xl font-bold mb-6 text-indigo-700">
              Services
            </h2>
            <div className="space-y-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between border-b border-gray-200 pb-4"
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
                        className="border rounded-lg px-3 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                        className="border rounded-lg px-3 py-2 w-1/4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <div>
                        <button
                          onClick={handleServiceSave}
                          className="text-green-600 hover:text-green-800 mr-2 transition duration-300 ease-in-out"
                        >
                          <Save size={20} />
                        </button>
                        <button
                          onClick={() => setEditingService(null)}
                          className="text-red-600 hover:text-red-800 transition duration-300 ease-in-out"
                        >
                          <X size={20} />
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
                      <div>
                        <button
                          onClick={() => handleServiceEdit(service)}
                          className="text-blue-600 hover:text-blue-800 mr-2 transition duration-300 ease-in-out"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => handleServiceDelete(service.id)}
                          className="text-red-600 hover:text-red-800 transition duration-300 ease-in-out"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center">
              <input
                type="text"
                placeholder="New service name"
                value={newService.name}
                onChange={(e) =>
                  setNewService({ ...newService, name: e.target.value })
                }
                className="border rounded-lg px-3 py-2 mr-2 flex-grow focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                placeholder="Price"
                value={newService.price}
                onChange={(e) =>
                  setNewService({ ...newService, price: e.target.value })
                }
                className="border rounded-lg px-3 py-2 mr-2 w-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleAddService}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out"
              >
                <Plus size={20} />
              </button>
            </div>
          </section>
        </div>

        {/* Customers Section */}
        <section className="bg-white rounded-2xl shadow-xl p-8 my-8 transition duration-300 ease-in-out transform hover:scale-105">
          <h2 className="text-3xl font-bold mb-6 text-indigo-700">Customers</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reviews.map((review) => (
                  <tr key={review.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <User className="h-10 w-10 rounded-full bg-gray-200 p-2" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {review.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {review.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {review.phone_number}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
        <section className="bg-white rounded-2xl shadow-xl p-8 transition duration-300 ease-in-out transform hover:scale-105">
          <h2 className="text-3xl font-bold mb-6 text-indigo-700">
            Settings and QR Code
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Settings Column */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4 text-indigo-600">
                Settings
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UPI ID
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="border rounded-lg px-3 py-2 flex-grow mr-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleUpiSave}
                    className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition duration-300 ease-in-out shadow-lg"
                  >
                    Save
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google My Business Place ID
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={placeId}
                    onChange={(e) => setPlaceId(e.target.value)}
                    className="border rounded-lg px-3 py-2 flex-grow mr-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handlePlaceIdSave}
                    className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition duration-300 ease-in-out shadow-lg"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>

            {/* QR Code Column */}
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold mb-4 text-indigo-600">
                Business Review QR Code
              </h3>
              {business && (
                <QRCode 
                  value={`https://reviewmanager.vercel.app/business/${business.id}`} 
                  size={200} 
                />
              )}
              <p className="mt-4 text-sm text-gray-600">
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
