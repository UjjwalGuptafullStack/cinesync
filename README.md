# CineSync 🎬

A visual-first social network for movie and TV show enthusiasts to share their watching journey with images and thoughts.

## Features

✅ **User Authentication** - Secure registration and login with JWT  
✅ **Visual Feed** - Instagram-style feed with user-uploaded images  
✅ **Image Upload** - Camera integration with automatic compression (Cloudinary)  
✅ **Create Posts** - Search movies/shows via TMDB and share your reactions  
✅ **Spoiler Protection** - Tag and reveal spoilers interactively  
✅ **Media Integration** - Rich movie/TV data with posters from TMDB  
✅ **Social Features** - Like/dislike, comments, follow/unfollow users  
✅ **Notifications** - Real-time alerts for interactions  
✅ **Context-Aware Posts** - Tag specific seasons/episodes for TV shows  

## Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- TMDB API Proxy
- **Cloudinary** - Cloud image storage
- **Multer** - File upload handling

**Frontend:**
- React + Vite
- Tailwind CSS v4
- React Router DOM
- Axios + React Toastify
- **Browser Image Compression** - Client-side optimization

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account or local MongoDB
- TMDB API Key ([Get one here](https://www.themoviedb.org/settings/api))
- **Cloudinary Account** ([Sign up free](https://cloudinary.com/))

### Backend Setup

1. Navigate to backend folder:
```bash
cd cinesync/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
TMDB_API_KEY=your_tmdb_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Start server:
```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd cinesync/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## Usage

1. **Register** - Create an account with username, email, and password
2. **Login** - Access your account and get authenticated
3. **Browse Feed** - View visual posts from users you follow
4. **Create Post**:
   - Click "+ POST" 
   - Search for a movie/show
   - **Tap the camera icon** to upload an image (or take a photo on mobile)
   - Write your thoughts
   - Optionally tag specific seasons/episodes for TV shows
5. **Spoiler Tags** - Mark posts as spoilers; readers can reveal them with a click
6. **Engage** - Like/dislike posts, leave comments, follow other cinephiles
7. **Notifications** - Get notified when others interact with your content

## Project Structure

```
cinesync/
├── backend/
│   ├── config/          # Database & Cloudinary configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── scripts/         # Utility scripts
│   └── server.js        # Entry point
└── frontend/
    └── src/
        ├── components/  # Reusable UI components
        ├── pages/       # Route pages
        └── App.jsx      # Main app component
```

## API Endpoints

### Users
- `POST /api/users` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/:username` - Get user profile
- `PUT /api/users/:id/track` - Follow/unfollow user

### Posts
- `GET /api/posts` - Get posts from followed users
- `POST /api/posts` - Create new post with optional image (multipart/form-data)
- `PUT /api/posts/:id/like` - Toggle like on post
- `PUT /api/posts/:id/dislike` - Toggle dislike on post

### Comments
- `GET /api/comments/:postId` - Get comments for a post
- `POST /api/comments/:postId` - Add comment to post

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

### Media
- `GET /api/media/search?query=` - Search movies/shows via TMDB
- `GET /api/media/tv/:id` - Get TV show details
- `GET /api/media/tv/:id/season/:seasonNum` - Get season episodes

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Backend server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `TMDB_API_KEY` | The Movie Database API key |
| **`CLOUDINARY_CLOUD_NAME`** | Cloudinary cloud name |
| **`CLOUDINARY_API_KEY`** | Cloudinary API key |
| **`CLOUDINARY_API_SECRET`** | Cloudinary API secret |

## Deployment

### Render (Backend)
1. Create new Web Service
2. Connect your GitHub repository
3. Add environment variables (all 7 from above)
4. Deploy

### Netlify (Frontend)
1. Create new site from Git
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variable: `VITE_API_URL=your_render_backend_url`
5. Deploy

## Version History

### V5 (Current) - Visual-First Platform 📸
- **Cloud Storage**: Cloudinary integration for image uploads
- **Camera UI**: Mobile-friendly camera/gallery picker
- **Image Compression**: Automatic client-side optimization (2MB limit)
- **Visual Feed**: Instagram-style layout with user images
- **Enhanced Design**: Orange/Black McLaren-inspired theme

### V4 - Theme Overhaul
- Inverted color scheme (Orange accents on black)
- Modern card-based UI
- Improved typography and spacing

### V3 - Social Features
- Like/Dislike system
- Comments and replies
- User notifications
- Follow/Unfollow functionality

### V2 - Engagement System
- Post interactions
- User tracking
- Feed personalization

### V1 - MVP
- Basic authentication
- Post creation
- TMDB integration
- Spoiler protection

## Contributing

Future enhancements planned:
- Video upload support
- Direct messaging
- Trending posts algorithm
- Advanced search filters
- User analytics dashboard

---

**Built with ❤️ using the MERN stack + Cloudinary**  
🟧⬛ *Inspired by the precision of McLaren*
