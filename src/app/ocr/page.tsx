"use client";

import { useState } from "react";
import axios from "axios";

export default function OCR() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setExtractedText(null); // Reset extracted text on new upload
    }
  };

  const handleProceed = async () => {
    if (!selectedImage) {
      alert("Please upload an image first!");
      return;
    }

    setLoading(true);
    setExtractedText(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedImage);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/ocr`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setExtractedText(response.data.text || "No text extracted.");
    } catch (error) {
      console.error("Error extracting text:", error);
      setExtractedText("An error occurred while processing the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-5xl w-full bg-white shadow-lg rounded-lg overflow-hidden flex">
        {/* Image Upload Section */}
        <div className="w-1/2 p-6 flex flex-col items-center justify-center bg-gray-100 border-r">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Uploaded Preview"
              className="max-h-96 rounded-lg shadow-md"
            />
          ) : (
            <div
              className="border-dashed border-2 border-gray-300 rounded-lg w-full h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <p className="text-gray-500 text-sm mb-2">
                Drag and drop an image here
              </p>
              <p className="text-gray-400 text-xs">or click to upload</p>
            </div>
          )}
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          {selectedImage && (
            <button
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              onClick={() => {
                setSelectedImage(null);
                setPreviewUrl(null);
                setExtractedText(null);
              }}
            >
              Remove Image
            </button>
          )}
        </div>

        {/* Extracted Text Section */}
        <div className="w-1/2 p-6 flex flex-col items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center">
              <div className="loader mb-4"></div>
              <p className="text-gray-600">Extracting text, please wait...</p>
            </div>
          ) : extractedText ? (
            <div className="w-full p-4 bg-gray-100 rounded-lg shadow-inner overflow-y-auto max-h-96">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Extracted Text:
              </h2>
              <p className="text-gray-800 whitespace-pre-wrap">{extractedText}</p>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              Upload an image and click "Extract Text" to see results here.
            </p>
          )}
          {selectedImage && (
            <button
              onClick={handleProceed}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Extract Text
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
