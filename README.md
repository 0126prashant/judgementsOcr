# Judgments & OCR Application

This is a Next.js-based application providing two main functionalities:

1. **Judgments Page**: Upload and manage multiple PDF files with options to select court type, year, and overwrite settings. Preview individual files before submission.
2. **OCR Page**: Upload a single image, view it, and extract text using OCR. Displays the extracted text alongside the uploaded image.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Judgments Page
- Upload multiple PDF files.
- Preview files before submission.
- Options:
  - Select a court: **Supreme Court** or **High Court**.
  - Choose a year between 1900 and 2025 (with guidance).
  - Overwrite existing documents with a warning prompt.
- Submit files to the backend and display the API response.

### OCR Page
- Upload a single image using drag-and-drop or file input.
- Preview the uploaded image in a large, styled container.
- Extract text using a **"Proceed"** button.
- Show loading animation while processing.
- Display the extracted text in a visually appealing container.

---

## Technologies Used

- **Frontend**: React, Tailwind CSS
- **Backend**: Next.js API Routes (for demonstration)
- **HTTP Requests**: Axios

---

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
2. Install dependencies:
    npm install
3. Start the development server:
     npm run dev
 

