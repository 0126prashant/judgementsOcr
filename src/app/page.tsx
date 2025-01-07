import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      {/* Header */}
      <header className="text-center mb-16">
        <h1 className="text-5xl font-bold text-blue-800">Judgments & OCR App</h1>
        <p className="text-lg text-blue-600 mt-4">
          Seamlessly manage and process legal documents with OCR capabilities.
        </p>
      </header>

      {/* Navigation Buttons */}
      <div className="flex gap-6">
        <Link href="/judgments">
          <button className="px-8 py-4 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all">
            Judgments
          </button>
        </Link>
        <Link href="/ocr">
          <button className="px-8 py-4 bg-gray-600 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-all">
            OCR
          </button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-gray-600 text-sm">
        © {new Date().getFullYear()} Judgments & OCR App. All rights reserved.
      </footer>
    </div>
  );
}
