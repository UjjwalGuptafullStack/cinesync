const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const postRoutes = require('./routes/postRoutes');
const socialRoutes = require('./routes/socialRoutes');
const commentRoutes = require('./routes/commentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const chatRoutes = require('./routes/chatRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { startCleanupJob } = require('./utils/cleanup');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

// Start cleanup job for old rejected friend requests
startCleanupJob();

const app = express();

// Middleware
app.use(express.json()); // Allows us to accept JSON data in the body
app.use(express.urlencoded({ extended: true })); // Allows us to parse form data

// CORS Configuration - Allow frontend from Vercel, Netlify, and local development
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://cinesync.vercel.app',
  'https://cinesync.netlify.app',
  // Add your custom domain here when ready
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('vercel.app') || origin.includes('netlify.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

// Simple Route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
