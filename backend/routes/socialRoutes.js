const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  searchUsers,
  sendRequest,
  getRequests,
  acceptRequest,
  rejectRequest,
  getSuggestions,
} = require('../controllers/socialController');

router.get('/search', protect, searchUsers);
router.get('/suggestions', protect, getSuggestions);
router.post('/follow/:id', protect, sendRequest);
router.get('/requests', protect, getRequests);
router.post('/accept/:id', protect, acceptRequest);
router.post('/reject/:id', protect, rejectRequest);

module.exports = router;
