const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  searchUsers,
  sendRequest,
  getRequests,
  acceptRequest,
} = require('../controllers/socialController');

router.get('/search', protect, searchUsers);
router.post('/follow/:id', protect, sendRequest); // :id is the USER ID you want to follow
router.get('/requests', protect, getRequests);
router.post('/accept/:id', protect, acceptRequest); // :id is the REQUEST ID

module.exports = router;
