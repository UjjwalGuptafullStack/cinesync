const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getNotifications } = require('../controllers/engagementController');

router.get('/', protect, getNotifications);

module.exports = router;
