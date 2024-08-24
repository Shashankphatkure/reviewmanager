"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiEye, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

const MyForms = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const storedForms = JSON.parse(localStorage.getItem("savedForms") || "[]");
    setForms(storedForms);
  }, []);

  const deleteForm = (formId) => {
    const updatedForms = forms.filter(form => form.id !== formId);
    setForms(updatedForms);
    localStorage.setItem("savedForms", JSON.stringify(updatedForms));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <h1 className="text-3xl font-bold">My Forms</h1>
          <p className="mt-2 text-blue-100">
            View and manage all your created forms
          </p>
        </div>
        <nav className="bg-gray-100 p-4">
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="text-blue-600 hover:text-blue-800 transition duration-300">
                Form Builder
              </Link>
            </li>
            <li>
              <Link href="/allforms" className="text-blue-600 hover:text-blue-800 transition duration-300">
                My Forms
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-8">
          {forms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">You haven't created any forms yet.</p>
              <Link
                href="/"
                className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 inline-flex items-center"
              >
                <FiPlus className="mr-2" /> Create Your First Form
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {forms.map((form) => (
                <div
                  key={form.id}
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition duration-300"
                >
                  <h2 className="text-xl font-semibold mb-2">{form.title}</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    {form.fields.length} fields
                  </p>
                  <div className="flex space-x-2">
                    <Link
                      href={`/form/${form.id}`}
                      className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 flex items-center justify-center"
                    >
                      <FiEye className="mr-2" /> View
                    </Link>
                    <Link
                      href={`/edit/${form.id}`}
                      className="flex-1 px-3 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300 flex items-center justify-center"
                    >
                      <FiEdit2 className="mr-2" /> Edit
                    </Link>
                    <button
                      onClick={() => deleteForm(form.id)}
                      className="flex-1 px-3 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300 flex items-center justify-center"
                    >
                      <FiTrash2 className="mr-2" /> Delete
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
            className="px-6 py-3 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition duration-300 inline-flex items-center"
          >
            <FiPlus className="mr-2" /> Create New Form
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyForms;