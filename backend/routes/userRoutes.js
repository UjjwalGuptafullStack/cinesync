const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/profile/:username', protect, getUserProfile);
router.put('/profile', protect, upload.single('image'), updateUserProfile);

module.exports = router;
