const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { toggleCommentLike, toggleCommentDislike, deleteComment } = require('../controllers/engagementController');

router.put('/:id/like', protect, toggleCommentLike);
router.put('/:id/dislike', protect, toggleCommentDislike);
router.delete('/:id', protect, deleteComment);

module.exports = router;
