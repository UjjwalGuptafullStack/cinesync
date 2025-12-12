# CineSync V7.2 - Deployment Guide

## 🚀 Deployment Instructions

### Prerequisites
- GitHub account
- Render account (for backend)
- Vercel or Netlify account (for frontend)
- MongoDB Atlas account
- Cloudinary account
- TMDB API key

---

## Backend Deployment (Render)

### Step 1: Prepare MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/cinesync`)

### Step 2: Get API Keys
- **TMDB API**: Get from [themoviedb.org](https://www.themoviedb.org/settings/api)
- **Cloudinary**: Get from [cloudinary.com/console](https://cloudinary.com/console)

### Step 3: Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the `backend` folder
5. Configure:
   - **Name**: `cinesync-backend`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<generate-random-string-here>
   TMDB_API_KEY=<your-tmdb-api-key>
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   ```
7. Click "Create Web Service"
8. **Copy your backend URL** (e.g., `https://cinesync-backend.onrender.com`)

---

## Frontend Deployment (Vercel)

### Step 1: Update API URL
1. Open `frontend/src/api.js`
2. Update the `baseURL` to your Render backend URL:
   ```javascript
   const api = axios.create({
     baseURL: 'https://cinesync-backend.onrender.com'
   });
   ```

### Step 2: Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click "Deploy"
6. Your app will be live at `https://your-app.vercel.app`

---

## Alternative: Frontend on Netlify

### Deploy to Netlify
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Click "Deploy site"

---

## Post-Deployment Checklist

### Backend (Render)
- ✅ Environment variables are set
- ✅ MongoDB connection is working
- ✅ Cloudinary is configured
- ✅ TMDB API is working
- ✅ Health check endpoint returns 200

### Frontend (Vercel/Netlify)
- ✅ API base URL points to production backend
- ✅ CORS is configured in backend
- ✅ All routes work (React Router)
- ✅ Images upload successfully
- ✅ Authentication works

---

## Environment Variables Reference

### Backend (.env)
```env
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cinesync
JWT_SECRET=your-super-secret-jwt-key-change-this
TMDB_API_KEY=your-tmdb-api-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

---

## Troubleshooting

### Backend Issues
- **500 Error**: Check Render logs for MongoDB connection issues
- **CORS Error**: Ensure frontend URL is in CORS whitelist
- **Image Upload Fails**: Verify Cloudinary credentials

### Frontend Issues
- **Blank Page**: Check browser console for API connection errors
- **404 on Refresh**: Ensure `vercel.json` or `netlify.toml` redirects are configured
- **API Not Found**: Verify `baseURL` in `api.js` points to production backend

---

## Quick Deploy Commands

### Build Frontend Locally (Test)
```bash
cd frontend
npm run build
npm run preview
```

### Test Backend Locally
```bash
cd backend
npm run dev
```

---

## Production URLs (After Deployment)
- **Backend**: `https://cinesync-backend.onrender.com`
- **Frontend**: `https://cinesync.vercel.app` or `https://cinesync.netlify.app`

---

## Version
CineSync V7.2.0 - McLaren Edition with Image Cropping & Chat Inbox
