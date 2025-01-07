"use client";

import { useState } from "react";

export default function Judgments() {
  const [courtName, setCourtName] = useState("");
  const [year, setYear] = useState("");
  const [overwrite, setOverwrite] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files)); // Convert FileList to an array
      setSelectedFile(null); // Reset selected file
    }
  };

  const handleFileClick = (file: File) => {
    setSelectedFile(file); // Set the clicked file as the selected file
  };

  const handleSubmit = async () => {
    if (!courtName || !year || files.length === 0) {
      setMessage("Please fill out all fields and upload at least one file.");
      return;
    }

    setMessage("Files are being uploaded...");
    try {
      const formData = new FormData();
      formData.append("courtName", courtName);
      formData.append("year", year);
      formData.append("overwrite", overwrite.toString());

      files.forEach((file) => {
        formData.append("files", file);
      });

      // Replace this with your backend API call
      console.log("Form Data submitted:", formData);

      setMessage("Files uploaded successfully!");
    } catch (error) {
      console.error("Error uploading files:", error);
      setMessage("Error uploading files. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-8 flex gap-8">
      {/* Form Section */}
      <div className="w-1/2 bg-white p-8 rounded-xl shadow-md">
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
              <option value="supreme court">Supreme Court</option>
              <option value="highcourt">High Court</option>
            </select>
          </div>

          {/* Year Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Year</label>
            <input
              type="number"
              min={1900}
              max={2025}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Enter year (e.g., 2023)"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            />
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
            className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
          >
            Submit
          </button>
        </form>

        {/* Message Display */}
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("Error") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      {/* File Preview Section */}
      <div className="w-1/2 bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">File Preview</h2>
        {selectedFile ? (
          <iframe
            src={URL.createObjectURL(selectedFile)}
            className="w-full h-[600px] border border-gray-300 rounded-lg"
            title="PDF Preview"
          />
        ) : (
          <p className="text-gray-600">Click on a file to preview it here.</p>
        )}
      </div>
    </div>
  );
}
