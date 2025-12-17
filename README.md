Here is a professional, comprehensive `README.md` for your **CineSync** project. This documentation captures everything we have built so far, from the MERN architecture to the specific AdSense and "Ghost Account" features.

You can copy-paste this directly into the root of your project folder.

---

# 🎬 CineSync

**The Social Network for Film Buffs & Binge Watchers.**

CineSync is a full-stack social platform designed for movie and TV show enthusiasts. It allows users to track their watch history, review content with spoiler protection, connect with friends, and engage with official Production Houses. Built with the **MERN Stack** (MongoDB, Express, React, Node.js) and integrated with the **TMDB API**.

---

## 🚀 Features

### **1. Core Social Experience**

* **Smart Feed:** Dynamic scroll of posts from friends and following networks.
* **Spoiler Protection:** Native "Spoiler Tag" system that blurs content until clicked. Users can tag specific Seasons/Episodes (e.g., "S1 E9").
* **Media Integration:** Auto-fetches high-res posters and metadata from **TMDB** (The Movie Database) when users tag a movie/show.
* **Rich Interactions:** Like, Comment, and Share functionality.

### **2. Authentication & Security**

* **Hybrid Auth:** Standard Email/Password login (JWT) + **Google OAuth 2.0** (Verified Email).
* **Role-Based Access:** Distinction between Standard Users, Verified Production Houses, and Admins.
* **Heartbeat System:** Real-time "Online/Offline" status tracking based on user activity.

### **3. Messaging System**

* **Real-Time Chat:** Instant messaging with friends.
* **Media Sharing:** Direct image uploads in chat via **Cloudinary**.
* **Smart UI:** Date separators (Today, Yesterday) and read receipts.

### **4. "Production House" Ecosystem**

* **Ghost Accounts:** Pre-seeded, unclaimed accounts for major studios (Warner Bros, Marvel, etc.) that users can follow before the studio officially joins.
* **Verification:** Secure "Claim Token" system for studios to take ownership of their profiles.
* **Official Badge:** Gold verification ticks for recognized industry accounts.

### **5. Monetization & Growth**

* **Programmatic Ads:** Integrated Google AdSense "Feed Ads" that inject natively between posts (every 5th item).
* **GDPR Compliance:** Built-in consent management for European users.
* **Network Discovery:** "People You May Know" suggestions injected directly into the feed (2nd-degree connections).

---

## 🛠 Tech Stack

### **Frontend**

* **Framework:** React (Vite)
* **Styling:** Tailwind CSS (Custom "Anthracite & Papaya" Dark Mode Theme)
* **State/Routing:** React Router DOM, React Hooks
* **Auth:** `@react-oauth/google`
* **Utilities:** `moment.js` (Time), `react-toastify` (Notifications), `react-icons`

### **Backend**

* **Runtime:** Node.js & Express.js
* **Database:** MongoDB Atlas (Mongoose ODM)
* **Storage:** Cloudinary (Image hosting & optimization)
* **Security:** `bcryptjs` (Hashing), `jsonwebtoken` (Auth), `cors`
* **External APIs:** TMDB API (Movie Data), Google Identity Services

---

## ⚙️ Installation & Setup

Prerequisites: **Node.js** (v18+) and **MongoDB** (Local or Atlas URI).

### **1. Clone the Repository**

```bash
git clone https://github.com/yourusername/cinesync.git
cd cinesync

```

### **2. Backend Setup**

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install

```

Create a `.env` file in `backend/` with the following keys:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development

# Cloudinary (Images)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# TMDB (Movie Data)
TMDB_API_KEY=your_tmdb_api_key

# Google Auth
GOOGLE_CLIENT_ID=your_google_client_id

```

Run the server:

```bash
npm run server
# Server should run on http://localhost:5000

```

### **3. Frontend Setup**

Open a new terminal, navigate to frontend, and install dependencies:

```bash
cd frontend
npm install

```

Create a `.env` file in `frontend/` (if using Vite, prefix with `VITE_`):

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id

```

Run the React app:

```bash
npm run dev
# App should launch on http://localhost:5173

```

---

## 📂 Project Structure

```text
cinesync/
├── backend/
│   ├── config/         # DB connection
│   ├── controllers/    # Logic for Auth, Posts, Users, Chat
│   ├── models/         # Mongoose Schemas (User, Post, Message)
│   ├── routes/         # API Endpoints
│   ├── scripts/        # Utility scripts (Seed Production Houses)
│   └── server.js       # Entry point
│
├── frontend/
│   ├── public/         # Static assets (ads.txt, favicon)
│   ├── src/
│   │   ├── components/ # Reusable UI (FeedAd, PostItem, Header)
│   │   ├── pages/      # Views (Landing, Home, Profile, Chat)
│   │   ├── context/    # Global State
│   │   └── api.js      # Axios instance
│   └── main.jsx        # React Entry
│
└── mobile_app/         # (Coming Soon) Flutter Cross-Platform App

```

---

## 🔮 Roadmap

* [x] **Beta Release:** Core social features and AdSense integration.
* [x] **Production Hubs:** Ghost account infrastructure.
* [ ] **Mobile App:** Cross-platform Flutter application (iOS/Android).
* [ ] **Watch Parties:** Real-time synchronized viewing.
* [ ] **AI Recommendations:** Movie suggestions based on social graph.

---

## 🤝 Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

**License:** MIT
**Contact:** [Ujjwal Gupta - ujjwal.gupta@research.iiit.ac.in]