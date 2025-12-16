const express = require('express');
const router = express.Router();
const { getPosts, createPost, deletePost, getPostsByMedia, getTrending } = require('../controllers/postController');
const {
  togglePostLike,
  togglePostDislike,
  addComment,
  getComments,
} = require('../controllers/engagementController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary');

// Multer error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Image file is too large. Maximum size is 10MB.' });
    }
    if (err.message) {
      return res.status(400).json({ message: err.message });
    }
  }
  next();
};

// Route for "/"
router.route('/').get(protect, getPosts).post(protect, upload.single('image'), handleMulterError, createPost);

// Public trending route (no auth needed)
router.get('/trending', getTrending);

// V8.0: Media Hub Route (must come before /:id routes)
router.get('/media/:tmdbId', protect, getPostsByMedia);

// Engagement Routes
router.put('/:id/like', protect, togglePostLike);
router.put('/:id/dislike', protect, togglePostDislike);
router.delete('/:id', protect, deletePost);
router.put('/:id/dislike', protect, togglePostDislike);
router.post('/:id/comment', protect, addComment);
router.get('/:id/comments', protect, getComments);

module.exports = router;
