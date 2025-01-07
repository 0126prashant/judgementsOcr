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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-7xl w-full bg-white shadow-2xl rounded-xl overflow-hidden flex">
        {/* Image Upload Section */}
        <div className="w-1/2 p-8 flex flex-col items-center justify-center bg-gray-100 border-r">
          <div
            className={`w-full h-[500px] ${
              previewUrl ? "" : "border-dashed border-4 border-gray-300"
            } rounded-lg flex items-center justify-center overflow-hidden shadow-md bg-white`}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Uploaded Preview"
                className="max-h-[500px] object-contain"
              />
            ) : (
              <div
                className="text-center cursor-pointer"
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                <p className="text-gray-500 text-lg font-semibold">
                  Drag and drop an image here
                </p>
                <p className="text-gray-400 text-sm">or click to upload</p>
              </div>
            )}
          </div>

          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {selectedImage && (
            <button
              className="mt-6 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
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
        <div className="w-1/2 p-8 flex flex-col items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center">
              <div className="loader mb-4"></div>
              <p className="text-gray-600 text-lg font-semibold">
                Extracting text, please wait...
              </p>
            </div>
          ) : extractedText ? (
            <div className="w-full h-[500px] bg-gray-50 p-6 rounded-lg shadow-inner overflow-y-auto">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">
                Extracted Text
              </h2>
              <p className="text-gray-800 text-lg whitespace-pre-wrap leading-relaxed">
                {extractedText}
              </p>
            </div>
          ) : (
            <div className="w-full h-[500px] bg-gray-50 p-6 rounded-lg shadow-inner flex items-center justify-center">
              <p className="text-gray-500 text-lg">
                Upload an image and click "Extract Text" to see results here.
              </p>
            </div>
          )}

          {selectedImage && (
            <button
              onClick={handleProceed}
              className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-md text-lg font-semibold hover:bg-blue-700 transition"
            >
              Extract Text
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
