const express = require('express');
const router = express.Router();
const { getPosts, createPost } = require('../controllers/postController');
const {
  togglePostLike,
  togglePostDislike,
  addComment,
  getComments,
} = require('../controllers/engagementController');
const { protect } = require('../middleware/authMiddleware');

// Route for "/"
// GET request runs 'protect' FIRST, then getPosts
// POST request runs 'protect' FIRST, then createPost
router.route('/').get(protect, getPosts).post(protect, createPost);

// Engagement Routes
router.put('/:id/like', protect, togglePostLike);
router.put('/:id/dislike', protect, togglePostDislike);
router.post('/:id/comment', protect, addComment);
router.get('/:id/comments', protect, getComments);

module.exports = router;
