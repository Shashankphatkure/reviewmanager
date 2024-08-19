"use client";

import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const FormBuilder = () => {
  const [formFields, setFormFields] = useState([]);
  const [formTitle, setFormTitle] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [savedForms, setSavedForms] = useState([]);
  const [currentView, setCurrentView] = useState("builder");
  const [currentFormId, setCurrentFormId] = useState(null);

  useEffect(() => {
    const storedForms = JSON.parse(localStorage.getItem("savedForms") || "[]");
    setSavedForms(storedForms);

    // Check if there's a form ID in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const formId = urlParams.get("formId");
    if (formId) {
      const form = storedForms.find((f) => f.id === formId);
      if (form) {
        setCurrentFormId(formId);
        setCurrentView("fillForm");
      }
    }
  }, []);

  const addField = (type) => {
    setFormFields([
      ...formFields,
      { id: uuidv4(), type, label: `New ${type}` },
    ]);
  };

  const updateField = (id, newLabel) => {
    setFormFields(
      formFields.map((field) =>
        field.id === id ? { ...field, label: newLabel } : field
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

  const submitForm = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let message = `Form submission from ${formTitle}:\n\n`;
    for (let [key, value] of formData.entries()) {
      message += `${key}: ${value}\n`;
    }
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const editForm = (formId) => {
    const form = savedForms.find((f) => f.id === formId);
    if (form) {
      setFormTitle(form.title);
      setFormFields(form.fields);
      setWhatsappNumber(form.whatsappNumber);
      setCurrentFormId(formId);
      setCurrentView("builder");
    }
  };

  const shareForm = (formId) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?formId=${formId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("Share link copied to clipboard!");
    });
  };

  const FormField = ({ field, preview }) => {
    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            name={field.label}
            placeholder={field.label}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        );
      case "textarea":
        return (
          <textarea
            name={field.label}
            placeholder={field.label}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        );
      case "radio":
        return (
          <div className="flex items-center space-x-2">
            <input type="radio" name={field.label} value="option1" required />
            <label>Option 1</label>
            <input type="radio" name={field.label} value="option2" />
            <label>Option 2</label>
          </div>
        );
      case "select":
        return (
          <select
            name={field.label}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select an option</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
        );
      case "date":
        return (
          <input
            type="date"
            name={field.label}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        );
      case "time":
        return (
          <input
            type="time"
            name={field.label}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        );
      default:
        return null;
    }
  };

  const renderBuilder = () => (
    <div className="p-8">
      <input
        type="text"
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
        placeholder="Enter form title"
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <input
        type="text"
        value={whatsappNumber}
        onChange={(e) => setWhatsappNumber(e.target.value)}
        placeholder="Enter WhatsApp number"
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      {formFields.map((field) => (
        <div
          key={field.id}
          className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm"
        >
          <input
            type="text"
            value={field.label}
            onChange={(e) => updateField(field.id, e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <FormField field={field} />
          <button
            onClick={() => removeField(field.id)}
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => addField("text")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
        >
          Add Text Field
        </button>
        <button
          onClick={() => addField("textarea")}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
        >
          Add Text Area
        </button>
        <button
          onClick={() => addField("radio")}
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300"
        >
          Add Radio Buttons
        </button>
        <button
          onClick={() => addField("select")}
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition duration-300"
        >
          Add Select
        </button>
        <button
          onClick={() => addField("date")}
          className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition duration-300"
        >
          Add Date
        </button>
        <button
          onClick={() => addField("time")}
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-300"
        >
          Add Time
        </button>
      </div>

      <div className="flex justify-between">
        <button
          onClick={saveForm}
          className="px-6 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-300"
        >
          Save Form
        </button>
        <button
          onClick={() => setShowPreview(true)}
          className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition duration-300"
        >
          Preview Form
        </button>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">{formTitle}</h2>
      <form onSubmit={submitForm}>
        {formFields.map((field) => (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            <FormField field={field} preview={true} />
          </div>
        ))}
        <button
          type="submit"
          className="w-full px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
        >
          Submit to WhatsApp
        </button>
      </form>
      <button
        onClick={() => setShowPreview(false)}
        className="mt-4 w-full px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
      >
        Back to Editor
      </button>
    </div>
  );

  const renderSavedForms = () => (
    <div className="p-8 bg-gray-50">
      <h3 className="text-xl font-semibold mb-4">Saved Forms</h3>
      <div className="space-y-2">
        {savedForms.map((form) => (
          <div
            key={form.id}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition duration-300"
          >
            <h4 className="font-medium">{form.title}</h4>
            <p className="text-sm text-gray-500">{form.fields.length} fields</p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => editForm(form.id)}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
              >
                Edit
              </button>
              <button
                onClick={() => shareForm(form.id)}
                className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
              >
                Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFillForm = () => {
    const form = savedForms.find((f) => f.id === currentFormId);
    if (!form) return <div>Form not found</div>;

    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">{form.title}</h2>
        <form onSubmit={submitForm}>
          {form.fields.map((field) => (
            <div key={field.id} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <FormField field={field} preview={true} />
            </div>
          ))}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
          >
            Submit to WhatsApp
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <h1 className="text-3xl font-bold">Advanced Form Builder</h1>
          <p className="mt-2 text-blue-100">
            Create, save, share, and fill custom forms
          </p>
        </div>

        {currentView === "builder" && !showPreview && renderBuilder()}
        {currentView === "builder" && showPreview && renderPreview()}
        {currentView === "fillForm" && renderFillForm()}

        {renderSavedForms()}
      </div>
    </div>
  );
};

export default FormBuilder;
