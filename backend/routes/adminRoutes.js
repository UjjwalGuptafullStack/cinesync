const express = require('express');
const router = express.Router();
const { 
  generateClaimLink, 
  claimAccount, 
  getGhostAccounts 
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// Public route for claiming account with token
router.post('/claim-account', claimAccount);

// Protected admin routes (you should add admin role check middleware)
router.post('/generate-claim/:studioId', protect, generateClaimLink);
router.get('/ghost-accounts', protect, getGhostAccounts);

module.exports = router;
