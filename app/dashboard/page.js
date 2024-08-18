"use client";

import React, { useState, useEffect } from "react";
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

const DashboardPage = () => {
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

  useEffect(() => {
    // Fetch initial data (mock data for demonstration)
    setReviews([
      { id: 1, name: "John Doe", rating: 4, comment: "Great service!" },
      {
        id: 2,
        name: "Jane Smith",
        rating: 5,
        comment: "Excellent quality fruits!",
      },
    ]);
    // setServices([
    //   { id: 1, name: "Basic Cleaning", price: 50 },
    //   { id: 2, name: "Deep Cleaning", price: 100 },
    // ]);

    setCustomers([
      {
        id: 1,
        name: "Alice Brown",
        email: "alice@example.com",
        phone: "123-456-7890",
      },
      {
        id: 2,
        name: "Charlie Davis",
        email: "charlie@example.com",
        phone: "098-765-4321",
      },
    ]);
    setUpiId("shashankphatkure-2@okicici");
    setPlaceId("ChIJywjU6WG_woAR3NrWwrEH_3M");
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        // Add a where clause if you need to filter by businessid
        // .eq('businessid', currentBusinessId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logging out...");
  };

  const handleBulkSms = () => {
    // Implement bulk SMS sending logic here
    console.log("Sending bulk SMS:", bulkSmsContent);
    // Reset the content after sending
    setBulkSmsContent("");
  };

  const handleBulkEmail = () => {
    // Implement bulk email sending logic here
    console.log("Sending bulk email:", {
      subject: bulkEmailSubject,
      content: bulkEmailContent,
    });
    // Reset the content after sending
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

  const handleUpiSave = () => {
    // Save UPI ID logic here
    console.log("UPI ID saved:", upiId);
  };

  const handlePlaceIdSave = () => {
    // Save Place ID logic here
    console.log("Place ID saved:", placeId);
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

  // ... (keep all the existing functions like handleServiceEdit, handleServiceSave, etc.)

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Reviews Section */}
          <section className="bg-white rounded-2xl shadow-xl p-8 transition duration-300 ease-in-out transform hover:scale-105">
            <h2 className="text-3xl font-bold mb-6 text-indigo-700">
              Recent Reviews
            </h2>
            <div className="mb-4 flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarFilter(star)}
                  className={`px-3 py-1 rounded-full ${
                    selectedStars.includes(star)
                      ? "bg-yellow-400 text-white"
                      : "bg-gray-200 text-gray-700"
                  } transition duration-300 ease-in-out`}
                >
                  {star} ⭐
                </button>
              ))}
            </div>
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-4">
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
                            i < review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 italic">{review.comment}</p>
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
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <User className="h-10 w-10 rounded-full bg-gray-200 p-2" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {customer.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {customer.phone}
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

        {/* Settings Section */}
        <section className="bg-white rounded-2xl shadow-xl p-8 transition duration-300 ease-in-out transform hover:scale-105">
          <h2 className="text-3xl font-bold mb-6 text-indigo-700">Settings</h2>
          <div className="space-y-6">
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
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
