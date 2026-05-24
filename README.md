<div align="center">
  <div style="background-color: #6366f1; width: 80px; height: 80px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto; margin-bottom: 20px;">
    <h1 style="color: white; margin: 0; font-family: sans-serif;">N</h1>
  </div>
  
  # NEXTCV 🚀
  
  **The Next-Generation AI Career Assistant**
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![Gemini API](https://img.shields.io/badge/Gemini_API-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📖 Overview

**NEXTCV** is a powerful, full-stack SaaS application designed to give job seekers an unfair advantage in the modern job market. By leveraging the advanced reasoning capabilities of the **Google Gemini 2.5 Flash API**, NEXTCV transforms static resumes into highly optimized, ATS-beating profiles.

It provides a complete end-to-end workflow: from parsing PDF resumes to analyzing skill gaps against real job descriptions, conducting mock AI interviews, and generating highly tailored cover letters.

## ✨ Core Features

* 📊 **ATS Analyzer:** Get an instant ATS compatibility score, detailed formatting feedback, and action verb analysis to ensure your resume passes automated filters.
* 🎯 **Job Match & Skill Gap:** Upload a target job description to instantly map your existing skills against requirements, complete with visual radar charts and personalized learning roadmaps.
* 💡 **AI Resume Suggestions:** Receive line-by-line, intelligent rewriting suggestions to make your bullet points more impactful and metrics-driven.
* 🎤 **Interactive Interview Prep:** Generate dynamic behavioral and technical interview questions based on your specific experience. Practice your answers and receive immediate AI grading and feedback.
* 📝 **Cover Letter Generator:** Generate compelling, customized cover letters tailored to both your resume and the target company's job description in seconds.
* 🗄️ **Persistent History:** Securely save and manage all your historical resume versions and generated AI analyses in a personal dashboard.

## 🛠️ Tech Stack

### Frontend
* **React 18** (Vite)
* **Tailwind CSS** (Styling & Design System)
* **Framer Motion** (Micro-animations & Page Transitions)
* **Recharts** (Data Visualization & Radar Charts)
* **Lucide React** (Modern Iconography)
* **Axios** (API Client)

### Backend
* **Node.js & Express.js** (REST API)
* **MongoDB & Mongoose** (Database & ODM)
* **Google Generative AI SDK** (Gemini Integration)
* **Multer** (File Upload Handling)
* **PDF-Parse** (Resume Text Extraction)
* **JWT & bcrypt** (Authentication & Security)

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+ recommended)
* MongoDB Database (Local or MongoDB Atlas)
* Google Gemini API Key ([Get it here](https://aistudio.google.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tiwarialok111/NEXTCV.git
   cd NEXTCV
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   CLIENT_URL=http://localhost:5173
   GEMINI_API_KEY=your_gemini_api_key
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to `http://localhost:5173` to see the application running.

## 🎨 Design Philosophy

NEXTCV was built with a premium, modern SaaS aesthetic in mind. It utilizes a sleek dark mode interface with deep violet and indigo accents, glassmorphism elements, and smooth micro-animations to create an engaging and confidence-inspiring user experience.

## 🔒 Security & Data Privacy

* **JWT-based Authentication:** Secure, HTTP-only cookies are used for session management.
* **Route Protection:** All API endpoints processing user resumes and AI generations are strictly protected.
* **Database Isolation:** Users can only access and modify their own documents and analysis data.

---

<div align="center">
  <p>Built with ❤️ for job seekers everywhere.</p>
</div>
