# OutSystems Solution Architecture AI

## 📖 Overview

This is a web-based tool designed to accelerate the application design and architecture phase for OutSystems developers. By uploading a multi-page PDF exported from a design tool like Figma, this application uses the Google Gemini API to analyze the visual and textual content and generate a comprehensive solution architecture blueprint.

The generated blueprint is tailored to OutSystems best practices, providing a structured starting point that includes data models, architecture layers, user roles, API endpoints, and more.

## ✨ Features

- **AI-Powered Analysis**: Leverages Google Gemini to interpret design files and extract architectural components.
- **Business Summary**: Generates a high-level summary of the application's purpose.
- **OutSystems Architecture Canvas**: Automatically categorizes proposed modules into the 3-Layer Canvas (End-User, Core, Foundation) with correct naming conventions.
- **Interactive ERD Diagram**: Visualizes the data model with draggable entities and auto-generated relationships. Can be exported to PNG.
- **Detailed Component Lists**: Generates structured lists for:
  - Entities (with attributes and keys)
  - Static Entities (with records)
  - Roles & Permissions
  - API Endpoints (with examples)
  - Pages/Screens
  - Site Properties
- **Asynchronous Process Recommendations**: Suggests Timers and BPT processes for background tasks and workflows if detected in the design.
- **Third-Party Service Recommendations**: Suggests external services (like Stripe for payments or AWS S3 for storage) based on application needs.
- **Export to PDF**: Compiles the entire analysis into a professionally formatted PDF report.
- **Dark Mode**: A sleek dark mode for comfortable viewing.
- **Custom API Key**: Users can securely use their own Google Gemini API key, which is stored in the browser's local storage.

## 🚀 How to Use

### 1. Exporting from Figma

For the best analysis results, you must export your design from Figma as a single, multi-page PDF file.

1.  In Figma, **select all the frames** you want to include in the analysis.
2.  Go to the main menu: **File > Export frames to PDF...**
3.  This will generate a single PDF file where each frame is a separate page.
4.  Save this consolidated PDF file to your computer.

### 2. Setting Up Your API Key

The application requires a Google Gemini API key to function.

1.  You can get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  When you first open the application, a pop-up will appear asking for your API key.
3.  Paste your key into the input field and click "Save". The key will be stored in your browser's local storage for future visits.
4.  You can update your key at any time by clicking the **key icon** in the header.

### 3. Analyzing Your Design

1.  Click the **"Choose PDF File"** button and select the multi-page PDF you exported from Figma.
2.  Click the **"Analyze Now"** button.
3.  Wait for the progress bar to complete. The analysis may take a minute depending on the size of your PDF.
4.  Once complete, the full architecture blueprint will be displayed. You can use the sidebar to navigate between sections.

## 🛠️ Running Locally

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
2.  **Serve the files:**
    You need a simple local server to run this project due to the use of ES modules. A simple way is to use `http-server` via npm.
    ```bash
    # Install http-server if you don't have it
    npm install -g http-server

    # Run the server from the project's root directory
    http-server
    ```
3.  **Access the application:**
    Open your web browser and navigate to the local address provided by `http-server` (e.g., `http://127.0.0.1:8080`).

> **Note**: The application uses ES modules and an `importmap` in `index.html` to load dependencies directly from a CDN (esm.sh). No local `npm install` for dependencies is required to run it.
