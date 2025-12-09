const Post = require('../models/Post');

// @desc    Get all posts (The Feed)
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    // Find all posts, sort by newest first
    // .populate() automatically replaces the 'user' ID with the actual user data (username)
    const posts = await Post.find()
      .populate('user', 'username') 
      .sort({ createdAt: -1 }); 
      
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private (Needs Login)
const createPost = async (req, res) => {
  const { tmdbId, mediaTitle, posterPath, content, season, episode, isSpoiler } = req.body;

  if (!content || !tmdbId || !mediaTitle) {
    return res.status(400).json({ message: 'Please include content and media details' });
  }

  try {
    const post = await Post.create({
      user: req.user.id, // We get this from the 'protect' middleware!
      tmdbId,
      mediaTitle,
      posterPath,
      content,
      season,
      episode,
      isSpoiler,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPosts, createPost };
