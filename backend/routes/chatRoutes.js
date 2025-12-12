const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { sendMessage, getConversation, getInbox } = require('../controllers/chatController');

router.post('/', protect, sendMessage);
router.get('/inbox', protect, getInbox); // Must be BEFORE /:userId to avoid treating "inbox" as a userId
router.get('/:userId', protect, getConversation);

module.exports = router;
