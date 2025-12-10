const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { toggleCommentLike, toggleCommentDislike } = require('../controllers/engagementController');

router.put('/:id/like', protect, toggleCommentLike);
router.put('/:id/dislike', protect, toggleCommentDislike);

module.exports = router;
