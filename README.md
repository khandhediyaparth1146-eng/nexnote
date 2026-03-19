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

## ✨ Features

- 🗒️ Create, Edit, Delete, Search Notes
- 🔒 Private / 👥 Shared / 🌐 Public visibility per note
- 🤖 AI Copilot: Summarize, Simplify, Extract Keywords
- 📊 Knowledge Graph (note connections)
- 📚 Study Mode (Flashcards)
- 📈 Analytics Dashboard
- 🌍 Explore Public Notes Community
- 👤 Author Profiles
