# NexNote — AI-Powered Intelligent Note Management Platform

> Built with React + Vite + TailwindCSS (Frontend) | Node.js + Express (Backend) | Python FastAPI (AI Service)

---

## 📁 Project Structure

```
NexNote/
├── client/          ← React Frontend (Vite + TailwindCSS)
├── server/          ← Node.js REST API Backend
└── ai-service/      ← Python FastAPI AI Microservice
```

---

## 🚀 How to Run

### 1. Frontend (React)
```bash
cd client
npm install
npm run dev
```
Then open: **http://localhost:5173**

### 2. Backend (Node.js)
```bash
cd server
npm install
node server.js
```
Backend runs on: **http://localhost:5000**

### 3. AI Service (Python)
```bash
cd ai-service
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn spacy
python main.py
```
AI service runs on: **http://localhost:8000**

---

## 🔌 MongoDB Atlas (Optional — Real Database)

1. Go to https://mongodb.com/atlas → Create free cluster
2. Copy your connection string
3. Create `server/.env`:
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/nexnote
```

---

## ✨ Comprehensive Features & Implementation

### 1. 🧠 AI Copilot & NLP Engine (The AI Microservice)
* **What it does:** Acts as a smart assistant that analyzes notes in real-time. It provides instant text summarization, content simplification, keyword extraction, and automatic flashcard generation.
* **Implementation:** Built as a dedicated **FastAPI Python Microservice**. It utilizes the `spaCy` Natural Language Processing (NLP) library to perform **Extractive Summarization**. It calculates word frequencies, scores sentences based on importance, and intelligently extracts the core meaning, alongside extracting Proper Nouns for auto-tagging.

### 2. 🌐 Collaboration Hub (Group Management)
* **What it does:** Allows users to create or join "Intelligence Circles" (Study Groups, Project Teams). Users can view a detailed list of all group members, their roles (e.g., Circle Founder vs. Researcher Node), and group objectives.
* **Implementation:** Built a custom React UI with **Framer Motion** animations. The Node.js/Express backend handles MongoDB relational data (`populate()`), linking user accounts to specific groups and mapping dynamic member lists with auto-generated avatars.

### 3. 🕸️ Knowledge Graph
* **What it does:** Visually maps out how different notes and ideas connect to each other across different domains, helping users find knowledge gaps and trends.
* **Implementation:** The frontend groups notes based on shared AI-generated tags and metadata, rendering a dynamic network graph that allows physical interaction and drag-and-drop mechanics.

### 4. ⚡ Intelligent Study Mode
* **What it does:** Automatically converts a user's text notes into an interactive flashcard quiz to accelerate learning.
* **Implementation:** An algorithmic approach splits documents into logical sentences and dynamically constructs Question/Answer pairs, instantly injecting them into a sleek Study UI—no manual card creation required.

### 5. ☁️ Cloud Sync & JWT Authentication
* **What it does:** Ensures notes are safely backed up to the cloud while keeping user data highly secure, with a failover system to prevent offline errors.
* **Implementation:** Integrated **MongoDB Atlas** for production cloud storage. We built a robust **Axios API Service** that passes secure JSON Web Tokens (JWT). The React Context handles a silent fallback mechanism to `localStorage` if the cloud fetch fails, ensuring a seamless offline-to-online experience.

### 6. 📱 Premium, Responsive UI/UX
* **What it does:** Provides a stunning, "wow-factor" dark-mode interface that works perfectly on Desktop, Tablets, and iPhones.
* **Implementation:** Utilized **Tailwind CSS** for responsive grid layouts and flexbox architectures. Integrated **Framer Motion** for zero-delay spring animations, subtle glowing background effects, and a highly polished layout.
