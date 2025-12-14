const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleLogin, getUserProfile, updateUserProfile, pingStatus } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary');

router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/google-login', googleLogin); // V8.1: Google OAuth
router.get('/profile/:username', protect, getUserProfile);
router.put('/profile', protect, upload.single('image'), updateUserProfile);
router.put('/ping', protect, pingStatus); // V8.3: Heartbeat for online status

module.exports = router;
