"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const MyForms = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const storedForms = JSON.parse(localStorage.getItem("savedForms") || "[]");
    setForms(storedForms);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <h1 className="text-3xl font-bold">My Forms</h1>
          <p className="mt-2 text-blue-100">
            View and manage all your created forms
          </p>
        </div>
        <div className="p-8">
          {forms.length === 0 ? (
            <p className="text-gray-500">You haven't created any forms yet.</p>
          ) : (
            <div className="space-y-4">
              {forms.map((form) => (
                <div
                  key={form.id}
                  className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition duration-300"
                >
                  <h2 className="text-xl font-semibold">{form.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {form.fields.length} fields
                  </p>
                  <div className="mt-4 flex space-x-2">
                    <Link
                      href={`/form/${form.id}`}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                    >
                      View
                    </Link>
                    <Link
                      href={`/edit/${form.id}`}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                    >
                      Edit
                    </Link>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-8 bg-gray-50">
          <Link
            href="/"
            className="px-6 py-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-300 inline-block"
          >
            Back to Form Builder
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyForms;
