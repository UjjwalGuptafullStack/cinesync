const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getNotifications, clearNotifications } = require('../controllers/engagementController');

router.get('/', protect, getNotifications);
router.delete('/', protect, clearNotifications);

module.exports = router;
