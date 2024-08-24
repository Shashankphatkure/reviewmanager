"use client";

import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";
import Image from 'next/image';
import Link from 'next/link';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { usePathname, useSearchParams } from 'next/navigation';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const FormBuilder = () => {
  const [formFields, setFormFields] = useState([]);
  const [formTitle, setFormTitle] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [savedForms, setSavedForms] = useState([]);
  const [currentView, setCurrentView] = useState("builder");
  const [currentFormId, setCurrentFormId] = useState(null);
  const [currentForm, setCurrentForm] = useState(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const storedForms = JSON.parse(localStorage.getItem("savedForms") || "[]");
    setSavedForms(storedForms);

    const formId = searchParams.get("formId");
    if (formId) {
      const form = storedForms.find((f) => f.id === formId);
      if (form) {
        setCurrentFormId(formId);
        setCurrentForm(form);
        setCurrentView("fillForm");
      }
    }
  }, [searchParams]);

  const addField = (type) => {
    setFormFields([
      ...formFields,
      { id: uuidv4(), type, label: `New ${type}`, options: type === 'radio' || type === 'checkbox' || type === 'select' || type === 'imageSelect' ? ['Option 1'] : [], required: false, images: type === 'imageSelect' ? [''] : [] },
    ]);
  };

  const updateField = (id, updates) => {
    setFormFields(
      formFields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  const addOption = (fieldId) => {
    setFormFields(
      formFields.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              options: [...field.options, `Option ${field.options.length + 1}`],
              images: field.type === 'imageSelect' ? [...field.images, ''] : field.images
            }
          : field
      )
    );
  };

  const updateOption = (fieldId, optionIndex, newValue) => {
    setFormFields(
      formFields.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              options: field.options.map((option, index) =>
                index === optionIndex ? newValue : option
              ),
            }
          : field
      )
    );
  };

  const removeOption = (fieldId, optionIndex) => {
    setFormFields(
      formFields.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              options: field.options.filter((_, index) => index !== optionIndex),
              images: field.type === 'imageSelect' ? field.images.filter((_, index) => index !== optionIndex) : field.images
            }
          : field
      )
    );
  };

  const removeField = (id) => {
    setFormFields(formFields.filter((field) => field.id !== id));
  };

  const saveForm = () => {
    const newForm = {
      id: currentFormId || uuidv4(),
      title: formTitle,
      fields: formFields,
      whatsappNumber,
    };
    const updatedForms = currentFormId
      ? savedForms.map((f) => (f.id === currentFormId ? newForm : f))
      : [...savedForms, newForm];
    setSavedForms(updatedForms);
    localStorage.setItem("savedForms", JSON.stringify(updatedForms));
    alert("Form saved successfully!");
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let message = `Form submission from ${formTitle}:\n\n`;
    let supabaseData = {
      form_title: formTitle,
      whatsapp_number: whatsappNumber,
    };

    for (let [key, value] of formData.entries()) {
      message += `${key}: ${value}\n`;
      supabaseData[key] = value;
    }

    // Send data to WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");

    // Send data to Supabase
    try {
      const { data, error } = await supabase
        .from("appointment")
        .insert([supabaseData]);

      if (error) throw error;
      console.log("Data inserted successfully:", data);
      alert("Form submitted successfully to WhatsApp and Supabase!");
    } catch (error) {
      console.error("Error inserting data:", error);
      alert("Error submitting form to Supabase. Please try again.");
    }
  };

  const editForm = (formId) => {
    // Instead of using router.push, we'll use window.location
    window.location.href = `/appointment?formId=${formId}`;
  };

  const shareForm = (formId) => {
    // You can implement sharing functionality here
    alert(`Share link: ${window.location.origin}/form/${formId}`);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(formFields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setFormFields(items);
  };

  const FormField = ({ field, preview }) => {
    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            name={field.label}
            placeholder={field.label}
            className="w-full p-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required={field.required}
          />
        );
      case "textarea":
        return (
          <textarea
            name={field.label}
            placeholder={field.label}
            className="w-full p-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required={field.required}
          />
        );
      case "radio":
        return (
          <div className="flex flex-col space-y-2">
            {field.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={field.label}
                  value={option}
                  required={field.required}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div className="flex flex-col space-y-2">
            {field.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={field.label}
                  value={option}
                  required={field.required}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      case "select":
        return (
          <select
            name={field.label}
            className="w-full p-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required={field.required}
          >
            <option value="">Select an option</option>
            {field.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "date":
        return (
          <input
            type="date"
            name={field.label}
            className="w-full p-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required={field.required}
          />
        );
      case "time":
        return (
          <input
            type="time"
            name={field.label}
            className="w-full p-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required={field.required}
          />
        );
      case "number":
        return (
          <input
            type="number"
            name={field.label}
            placeholder={field.label}
            className="w-full p-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required={field.required}
          />
        );
      case "file":
        return (
          <input
            type="file"
            name={field.label}
            accept={field.fileType || "*"}
            className="w-full p-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required={field.required}
          />
        );
      case "image":
        return (
          <div>
            <input
              type="file"
              name={field.label}
              accept="image/*"
              className="w-full p-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required={field.required}
            />
            {preview && field.previewUrl && (
              <Image src={field.previewUrl} alt="Preview" width={200} height={200} className="mt-2" />
            )}
          </div>
        );
      case "rating":
        return (
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value} className="flex items-center">
                <input
                  type="radio"
                  name={field.label}
                  value={value}
                  required={field.required}
                />
                <span className="ml-1">{value}</span>
              </label>
            ))}
          </div>
        );
      case "imageSelect":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {field.options.map((option, index) => (
              <label key={index} className="flex flex-col items-center cursor-pointer">
                <input
                  type="radio"
                  name={field.label}
                  value={option}
                  required={field.required}
                  className="sr-only peer"
                />
                <div className="relative w-full aspect-square mb-2 ring-2 ring-transparent peer-checked:ring-indigo-500 rounded-lg overflow-hidden transition-all duration-300">
                  <Image
                    src={field.images[index] || '/placeholder-image.jpg'}
                    alt={option}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                  <div className="absolute inset-0 bg-indigo-500 bg-opacity-0 peer-checked:bg-opacity-20 transition-all duration-300"></div>
                </div>
                <span className="text-center peer-checked:font-bold">{option}</span>
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const renderBuilder = () => (
    <div className="p-8 space-y-8 bg-gray-50 rounded-lg shadow-lg">
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
        <input
          type="text"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          placeholder="Enter form title"
          className="w-full p-3 text-2xl font-bold border-b-2 border-indigo-300 focus:border-indigo-500 focus:outline-none transition duration-300 bg-transparent"
        />
        <input
          type="text"
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value)}
          placeholder="Enter WhatsApp number"
          className="w-full p-3 mt-4 border-b-2 border-indigo-300 focus:border-indigo-500 focus:outline-none transition duration-300 bg-transparent"
        />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="fields">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
              {formFields.map((field, index) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div {...provided.dragHandleProps} className="cursor-move">
                          ☰
                        </div>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => updateField(field.id, { label: e.target.value })}
                          className="flex-grow p-2 ml-4 text-lg font-medium border-b-2 border-indigo-200 focus:border-indigo-500 focus:outline-none transition duration-300"
                        />
                        <button
                          onClick={() => removeField(field.id)}
                          className="ml-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
                        >
                          ✕
                        </button>
                      </div>
                      <FormField field={field} />
                      {(field.type === 'radio' || field.type === 'checkbox' || field.type === 'select' || field.type === 'imageSelect') && (
                        <div className="mt-4 bg-indigo-50 p-4 rounded-md">
                          <h4 className="font-medium mb-2 text-indigo-700">Options:</h4>
                          {field.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2 mb-2">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => updateOption(field.id, optionIndex, e.target.value)}
                                className="flex-grow p-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              />
                              {field.type === 'imageSelect' && (
                                <input
                                  type="text"
                                  value={field.images[optionIndex] || ''}
                                  onChange={(e) => {
                                    const newImages = [...field.images];
                                    newImages[optionIndex] = e.target.value;
                                    updateField(field.id, { images: newImages });
                                  }}
                                  className="flex-grow p-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                  placeholder="Image URL"
                                />
                              )}
                              <button
                                onClick={() => removeOption(field.id, optionIndex)}
                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addOption(field.id)}
                            className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition duration-300"
                          >
                            + Add Option
                          </button>
                        </div>
                      )}
                      <div className="mt-4 flex items-center justify-between">
                        <label className="flex items-center text-indigo-700">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateField(field.id, { required: e.target.checked })}
                            className="mr-2 form-checkbox h-5 w-5 text-indigo-600"
                          />
                          Required
                        </label>
                        {field.type === 'file' && (
                          <input
                            type="text"
                            value={field.fileType || ''}
                            onChange={(e) => updateField(field.id, { fileType: e.target.value })}
                            placeholder="File type (e.g., .pdf,.doc)"
                            className="p-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-indigo-700">Add New Field</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { type: "text", label: "Text", icon: "🔤" },
            { type: "textarea", label: "Text Area", icon: "📝" },
            { type: "radio", label: "Radio", icon: "🔘" },
            { type: "checkbox", label: "Checkbox", icon: "☑️" },
            { type: "select", label: "Select", icon: "▼" },
            { type: "date", label: "Date", icon: "📅" },
            { type: "time", label: "Time", icon: "⏰" },
            { type: "number", label: "Number", icon: "🔢" },
            { type: "file", label: "File Upload", icon: "📎" },
            { type: "image", label: "Image Upload", icon: "🖼️" },
            { type: "rating", label: "Rating", icon: "⭐" },
            { type: "imageSelect", label: "Image Select", icon: "🖼️" },
          ].map(({ type, label, icon }) => (
            <button
              key={type}
              onClick={() => addField(type)}
              className="px-4 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition duration-300 flex items-center justify-center"
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={saveForm}
          className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300 flex items-center justify-center shadow-md"
        >
          💾 Save Form
        </button>
        <button
          onClick={() => setShowPreview(true)}
          className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 flex items-center justify-center shadow-md"
        >
          👁️ Preview Form
        </button>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">{formTitle}</h2>
      <form onSubmit={submitForm} className="space-y-6">
        {formFields.map((field) => (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium text-indigo-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <FormField field={field} preview={true} />
          </div>
        ))}
        <button
          type="submit"
          className="w-full px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300"
        >
          Submit
        </button>
      </form>
      <button
        onClick={() => setShowPreview(false)}
        className="mt-6 w-full px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition duration-300 flex items-center justify-center"
      >
        ← Back to Editor
      </button>
    </div>
  );

  const renderSavedForms = () => (
    <div className="p-8 bg-indigo-50 rounded-lg shadow-inner">
      <h3 className="text-2xl font-semibold mb-6 text-indigo-700">Saved Forms</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {savedForms.map((form) => (
          <div
            key={form.id}
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300"
          >
            <h4 className="text-xl font-medium mb-2 text-indigo-700">{form.title}</h4>
            <p className="text-sm text-indigo-500 mb-4">{form.fields.length} fields</p>
            <div className="flex space-x-2">
              <Link
                href={`/form/${form.id}`}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 flex items-center justify-center"
              >
                👁️ View
              </Link>
              <button
                onClick={() => editForm(form.id)}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300 flex items-center justify-center"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => shareForm(form.id)}
                className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition duration-300 flex items-center justify-center"
              >
                🔗 Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFillForm = () => {
    if (!currentForm) return null;

    return (
      <div className="p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-indigo-700">{currentForm.title}</h2>
        <form onSubmit={submitForm} className="space-y-6">
          {currentForm.fields.map((field) => (
            <div key={field.id} className="mb-4">
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <FormField field={field} preview={true} />
            </div>
          ))}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <h1 className="text-4xl font-bold">Advanced Form Builder</h1>
          <p className="mt-2 text-indigo-100">
            Create, save, share, and fill custom forms with ease
          </p>
        </div>

        <nav className="bg-indigo-100 p-4">
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="text-indigo-600 hover:text-indigo-800 transition duration-300">
                Form Builder
              </Link>
            </li>
            <li>
              <Link href="/allforms" className="text-indigo-600 hover:text-indigo-800 transition duration-300">
                My Forms
              </Link>
            </li>
          </ul>
        </nav>

        {currentView === "builder" && !showPreview && renderBuilder()}
        {currentView === "builder" && showPreview && renderPreview()}
        {currentView === "fillForm" && renderFillForm()}

        {currentView !== "fillForm" && renderSavedForms()}
      </div>
    </div>
  );
};

export default FormBuilder;
