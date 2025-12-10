const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Post = require('../models/Post');

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 1. Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id), // Give them a token right away
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check for user email
    const user = await User.findOne({ email });

    // 2. Check password (compare plain text input with hashed DB password)
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get User Profile (Info, Stats, Watched List)
// @route   GET /api/users/profile/:username
// @access  Private
const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    // 1. Find the target user (exclude password)
    const targetUser = await User.findOne({ username }).select('-password');

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Fetch all posts by this user
    // Populate the user field in the post so the PostItem component still works
    const posts = await Post.find({ user: targetUser._id })
      .populate('user', 'username') 
      .sort({ createdAt: -1 });

    // 3. Generate "Watched List" (Unique shows/movies from posts)
    // Map ensures no duplicates based on tmdbId
    const watchedMap = new Map();
    posts.forEach((post) => {
      if (!watchedMap.has(post.tmdbId)) {
        watchedMap.set(post.tmdbId, {
          tmdbId: post.tmdbId,
          title: post.mediaTitle,
          poster: post.posterPath,
          type: post.mediaType,
        });
      }
    });
    const watchedList = Array.from(watchedMap.values());

    // 4. Privacy Logic
    const amTrackingTarget = targetUser.audience.includes(req.user.id);
    const isMe = targetUser._id.equals(req.user.id);
    const canViewFullProfile = amTrackingTarget || isMe;
    
    let networkData = null;
    let safePosts = [];
    let safeWatchedList = [];

    if (canViewFullProfile) {
      // ACCESS GRANTED: Show everything
      await targetUser.populate('tracking', 'username');
      await targetUser.populate('audience', 'username');
      networkData = {
        tracking: targetUser.tracking,
        audience: targetUser.audience,
      };
      safePosts = posts;
      safeWatchedList = watchedList;
    }

    // 5. Send Response
    res.json({
      _id: targetUser._id,
      username: targetUser.username,
      createdAt: targetUser.createdAt,
      stats: {
        trackingCount: targetUser.tracking.length,
        audienceCount: targetUser.audience.length,
        watchedCount: watchedList.length, // We still show the COUNT, just not the items
      },
      isPrivate: !canViewFullProfile, // Flag for Frontend
      network: networkData, 
      watchedList: safeWatchedList, // Empty if private
      posts: safePosts, // Empty if private
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
