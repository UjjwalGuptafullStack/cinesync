# CineSync 🎬

A full-stack social network for movie and TV show enthusiasts to share their watching journey and thoughts.

## Features (MVP)

✅ **User Authentication** - Secure registration and login with JWT  
✅ **Global Feed** - View posts from all users  
✅ **Create Posts** - Search movies/shows via TMDB and share your thoughts  
✅ **Spoiler Protection** - Tag and reveal spoilers interactively  
✅ **Media Integration** - Rich movie/TV data with posters from TMDB

## Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- TMDB API Proxy

**Frontend:**
- React + Vite
- Tailwind CSS v4
- React Router DOM
- Axios + React Toastify

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account or local MongoDB
- TMDB API Key ([Get one here](https://www.themoviedb.org/settings/api))

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
3. **Browse Feed** - View posts from the community on the home page
4. **Create Entry** - Click "+ Log Entry" to search for a movie/show and share your thoughts
5. **Spoiler Tags** - Mark posts as spoilers; readers can reveal them with a click

## Project Structure

```
cinesync/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
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

### Posts
- `GET /api/posts` - Get all posts (public)
- `POST /api/posts` - Create new post (authenticated)

### Media
- `GET /api/media/search?query=` - Search movies/shows via TMDB

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Backend server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `TMDB_API_KEY` | The Movie Database API key |

## Contributing

This is an MVP. Future enhancements planned:
- User profiles
- Like/comment system
- Follow/unfollow users
- Episode tracking for TV shows
- Personalized recommendations

---

Built with ❤️ using the MERN stack
