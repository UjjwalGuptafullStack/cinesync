const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @desc    Generate a secure claim link for a ghost studio account
// @route   POST /api/admin/generate-claim/:studioId
// @access  Admin only
const generateClaimLink = async (req, res) => {
  const { studioId } = req.params; // The MongoDB _id of the ghost account

  try {
    const studio = await User.findById(studioId);
    
    if (!studio) {
      return res.status(404).json({ message: "Studio not found" });
    }
    
    if (studio.isClaimed) {
      return res.status(400).json({ message: "Account already claimed" });
    }

    if (studio.role !== 'production') {
      return res.status(400).json({ message: "This is not a production house account" });
    }

    // 1. Generate a random secure token (64 characters)
    const token = crypto.randomBytes(32).toString('hex');
    
    // 2. Save it to the user record
    studio.claimToken = token;
    await studio.save();

    // 3. Generate the claim link (use your production domain in .env)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const claimLink = `${frontendUrl}/claim-account/${token}`;
    
    res.json({ 
      success: true,
      studio: studio.username,
      tmdbId: studio.tmdbCompanyId,
      link: claimLink,
      message: `Send this link to ${studio.username} representatives to claim their account.`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify claim token and activate studio account
// @route   POST /api/admin/claim-account
// @access  Public (token-protected)
const claimAccount = async (req, res) => {
  const { token, email, password } = req.body;

  try {
    // Validate required fields
    if (!token || !email || !password) {
      return res.status(400).json({ message: "Token, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Find studio by claim token
    const studio = await User.findOne({ claimToken: token });

    if (!studio) {
      return res.status(404).json({ message: "Invalid or expired claim token" });
    }

    if (studio.isClaimed) {
      return res.status(400).json({ message: "This account has already been claimed" });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update account with credentials
    studio.email = email;
    studio.password = hashedPassword; // Store hashed password
    studio.isClaimed = true;
    studio.claimToken = null; // Clear the token
    studio.isVerified = true; // Mark as verified production house

    await studio.save();

    res.json({
      success: true,
      message: `Welcome to CineSync, ${studio.username}! Your account is now active.`,
      username: studio.username,
      audience: studio.audience.length // Show them their existing follower count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all unclaimed ghost accounts (for admin dashboard)
// @route   GET /api/admin/ghost-accounts
// @access  Admin only
const getGhostAccounts = async (req, res) => {
  try {
    const ghosts = await User.find({ 
      role: 'production', 
      isClaimed: false 
    }).select('username tmdbCompanyId audience createdAt');

    res.json({
      count: ghosts.length,
      studios: ghosts.map(g => ({
        id: g._id,
        username: g.username,
        tmdbId: g.tmdbCompanyId,
        followers: g.audience.length,
        created: g.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateClaimLink,
  claimAccount,
  getGhostAccounts
};
