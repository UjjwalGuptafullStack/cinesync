const express = require('express');
const router = express.Router();
const { getPosts, createPost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// Route for "/"
// GET request runs 'protect' FIRST, then getPosts
// POST request runs 'protect' FIRST, then createPost
router.route('/').get(protect, getPosts).post(protect, createPost);

module.exports = router;
