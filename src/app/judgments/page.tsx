"use client";

import { useState } from "react";
import axios from "axios";

export default function Judgments() {
  const [courtName, setCourtName] = useState(""); // Court Enum (High Court, Supreme Court)
  const [year, setYear] = useState(""); // Year (2000 to 2025)
  const [month, setMonth] = useState(""); // Month Enum (January, February, etc.)
  const [overwrite, setOverwrite] = useState(false); // Overwrite Boolean
  const [files, setFiles] = useState<File[]>([]); // List of files
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setSelectedFile(null);
      setShowPreview(false);
    }
  };

  const handleFileClick = (file: File) => {
    setSelectedFile(file);
    setShowPreview(true);
  };

  const handleSubmit = async () => {
    if (!courtName || !year || !month || files.length === 0) {
      setResponseMessage("Please fill out all fields and upload at least one file.");
      return;
    }
  
    setLoading(true);
    setResponseMessage("");
  
    try {
      const formData = new FormData();
      
      // Format court name to match backend enum (exactly as specified in Court enum)
      formData.append("court", courtName);
      
      // Send year as is - backend expects the year value directly
      formData.append("year", year);
      
      // Month is already in correct format as it matches the Month enum
      formData.append("month", month);
      
      // Convert boolean to string matching OverwriteOption enum ("True"/"False")
      formData.append("overwrite", overwrite ? "True" : "False");
      
      // Append files
      files.forEach((file) => {
        formData.append("files", file);
      });
  
      // Log the payload for debugging
      const payload = [];
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          payload.push(`${key}: ${value.name}`);
        } else {
          payload.push(`${key}: ${value}`);
        }
      }
      console.log("Payload being sent:", payload);
      
      // Debug log the actual FormData values
      console.log("FormData values:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
  
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/api/ai/upload_judgements`,
        formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      setResponseMessage(
        `Uploaded: ${response.data.uploaded_judgements.length} files, Failed: ${response.data.failed_judgements.length} files.`
      );
      console.log("API Response:", response.data);
    } catch (error: any) {
      let errorMessage = "Error uploading files. Please try again.";
      
      // Handle different types of error details
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (typeof detail === 'string') {
          errorMessage += ` Details: ${detail}`;
        } else if (typeof detail === 'object') {
          // If detail is an object, stringify it properly
          errorMessage += ` Details: ${JSON.stringify(detail)}`;
        }
      }
      
      // Log the complete error information for debugging
      console.error("Complete error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        details: error.response?.data?.detail
      });

      setResponseMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component remains the same...
  
  return (
    <div
      className={`min-h-screen bg-gray-50 py-12 px-8 flex ${
        showPreview ? "gap-8" : "justify-center"
      }`}
    >
      {/* Main UI */}
      <div
        className={`bg-white p-8 rounded-xl shadow-md transition-all ${
          showPreview ? "w-1/2" : "w-full"
        }`}
      >
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Upload Judgments</h1>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-6"
          encType="multipart/form-data"
        >
          {/* Court Name Dropdown */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Court Name
            </label>
            <select
              value={courtName}
              onChange={(e) => setCourtName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">Select Court</option>
              <option value="Supreme Court">Supreme Court</option>
              <option value="High Court">High Court</option>
            </select>
          </div>

          {/* Year Dropdown */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Year
              <span className="block text-sm text-gray-500">
                Select a year between 2000 to 2025.
              </span>
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">Select Year</option>
              {Array.from({ length: 26 }, (_, i) => 2000 + i).map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Month Dropdown */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">Select Month</option>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Overwrite Checkbox */}
          <div>
            <label className="flex items-center text-gray-700 font-medium">
              <input
                type="checkbox"
                checked={overwrite}
                onChange={(e) => setOverwrite(e.target.checked)}
                className="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-300"
              />
              Overwrite Existing Documents
            </label>
            {overwrite && (
              <p className="mt-2 text-red-600 text-sm">
                Warning: This will replace existing documents.
              </p>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Upload PDFs
            </label>
            <input
              type="file"
              accept="application/pdf"
              multiple
              onChange={handleFileUpload}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            />
            {files.length > 0 && (
              <ul className="mt-4">
                <p className="text-gray-500 text-sm mb-2">
                  Click on a file to preview it.
                </p>
                {files.map((file, index) => (
                  <li
                    key={index}
                    className="text-blue-600 cursor-pointer hover:underline"
                    onClick={() => handleFileClick(file)}
                  >
                    {file.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-3 rounded-lg shadow-lg transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading ? "Uploading..." : "Submit"}
          </button>
        </form>

        {/* API Response */}
        {responseMessage && (
          <p
            className={`mt-4 text-center ${
              responseMessage.includes("Error")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {responseMessage}
          </p>
        )}
      </div>

      {/* File Preview Section */}
      {showPreview && selectedFile && (
        <div className="w-1/2 bg-white p-8 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">File Preview</h2>
            <button
              className="text-red-600 hover:underline"
              onClick={() => setShowPreview(false)}
            >
              Close Preview
            </button>
          </div>
          <iframe
            src={URL.createObjectURL(selectedFile)}
            className="w-full h-[600px] border border-gray-300 rounded-lg"
            title="PDF Preview"
          />
        </div>
      )}
    </div>
  );
}