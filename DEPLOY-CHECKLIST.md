# 🚀 CineSync V7.2 - Quick Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Code Preparation
- [x] Frontend builds successfully (`npm run build`)
- [x] Backend starts without errors (`npm start`)
- [x] All environment variables documented
- [x] CORS configured for production
- [x] API base URL uses environment variable

### 2. Required Accounts & Services
- [ ] GitHub repository created/updated
- [ ] MongoDB Atlas account with cluster created
- [ ] Cloudinary account with credentials
- [ ] TMDB API key obtained
- [ ] Render account created (for backend)
- [ ] Vercel/Netlify account created (for frontend)

---

## 🎯 Deployment Steps

### STEP 1: Backend Deployment (Render)

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Deploy CineSync V7.2 - Production Ready"
   git push origin main
   ```

2. **Deploy on Render**
   - Go to: https://dashboard.render.com/
   - Click: "New +" → "Web Service"
   - Connect your GitHub repo
   - Settings:
     - Name: `cinesync-backend`
     - Root Directory: `backend`
     - Build Command: `npm install`
     - Start Command: `npm start`
   
3. **Add Environment Variables** (In Render Dashboard)
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<generate-random-string>
   TMDB_API_KEY=<your-tmdb-key>
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
   CLOUDINARY_API_KEY=<your-cloudinary-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-secret>
   ```

4. **Save Backend URL**
   - Copy your Render URL: `https://cinesync-backend-XXXX.onrender.com`

---

### STEP 2: Frontend Deployment (Vercel)

1. **Update API URL** (Optional - if not using env var)
   - Create `frontend/.env.production`:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com
     ```

2. **Deploy on Vercel**
   - Go to: https://vercel.com/new
   - Import your GitHub repository
   - Settings:
     - Framework: Vite
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add Environment Variable:
     - Name: `VITE_API_URL`
     - Value: `https://your-backend-url.onrender.com`

3. **Deploy & Test**
   - Click "Deploy"
   - Visit your URL: `https://cinesync-XXXX.vercel.app`

---

## 🔧 Environment Variables Guide

### Backend (.env on Render)
```env
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cinesync
JWT_SECRET=super-secret-random-string-here
TMDB_API_KEY=your-tmdb-api-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
```

### Frontend (.env.production or Vercel Environment Variables)
```env
VITE_API_URL=https://cinesync-backend-XXXX.onrender.com
```

---

## 🧪 Post-Deployment Testing

### Backend Health Check
- [ ] Visit: `https://your-backend.onrender.com/`
- [ ] Should see: "API is running..."

### Frontend Testing
- [ ] Homepage loads
- [ ] User registration works
- [ ] User login works
- [ ] Posts display correctly
- [ ] Image upload works (Cloudinary)
- [ ] Chat system works
- [ ] Profile pictures display
- [ ] Search/Discovery works
- [ ] Notifications work

---

## 🐛 Common Issues & Solutions

### Issue: CORS Error
**Solution**: Update backend CORS to include your frontend URL
```javascript
// In backend/server.js
const allowedOrigins = [
  'https://your-actual-vercel-url.vercel.app'
];
```

### Issue: MongoDB Connection Failed
**Solution**: 
1. Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for all IPs)
2. Verify connection string in Render environment variables
3. Check MongoDB Atlas cluster is running

### Issue: Images Not Uploading
**Solution**: Verify Cloudinary credentials in Render environment variables

### Issue: Frontend Shows Blank Page
**Solution**: 
1. Check browser console for errors
2. Verify `VITE_API_URL` is set correctly
3. Check that backend is running

---

## 📊 Deployment Status

- Backend URL: `________________________`
- Frontend URL: `________________________`
- MongoDB Cluster: `________________________`
- Deployment Date: `________________________`

---

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Users can register and login
- ✅ Users can create posts with images
- ✅ Chat system works between users
- ✅ Profile pictures upload and display
- ✅ Feed shows posts from followed users
- ✅ Notifications appear in real-time

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **Cloudinary Docs**: https://cloudinary.com/documentation

---

**Version**: CineSync V7.2.0 - McLaren Edition
**Last Updated**: December 12, 2025
