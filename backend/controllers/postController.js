const User = require('../models/User');
const Post = require('../models/Post');

// @desc    Get posts from me and people I follow (V8.0: Smart Feed with Production Houses)
// @route   GET /api/posts
// @access  Private
const getPosts = async (req, res) => {
  try {
    // 1. Get the current user to find who they're tracking
    const currentUser = await User.findById(req.user.id);
    
    // 2. Get IDs of people I follow
    const followingIds = currentUser.tracking || [];
    
    // 3. Get TMDB IDs from MY Library
    const myLibraryTmdbIds = currentUser.library || [];
    
    // 4. Find all Production House User IDs (V8.0: Smart Feed)
    const productionHouseIds = await User.find({ role: 'production' }).distinct('_id');

    // 5. Smart Feed Logic:
    //    A. Posts from people I follow
    //    B. My own posts
    //    C. Production House posts about movies in MY library (Implicit Interest)
    const posts = await Post.find({
      $or: [
        { user: { $in: followingIds } }, // Condition A: Following
        { user: req.user.id },           // Condition B: My posts
        { 
          user: { $in: productionHouseIds },     // Condition C: It's a studio...
          tmdbId: { $in: myLibraryTmdbIds }      // ...posting about something I watched
        }
      ]
    })
      .populate('user', 'username userImage role') // V8.0: Include role for badges
      .sort({ createdAt: -1 }) // Newest first
      .limit(50); // Limit for performance

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private (requires login)
const createPost = async (req, res) => {
  const { tmdbId, mediaTitle, posterPath, content, isSpoiler, mediaType, season, episode } = req.body;

  // Validation
  if (!tmdbId || !mediaTitle || !content || !mediaType) {
    return res.status(400).json({ 
      message: 'Please provide tmdbId, mediaTitle, content, and mediaType' 
    });
  }

  // If it's a TV show and season/episode provided, validate them
  if (mediaType === 'tv' && (season || episode)) {
    if (season && season < 1) {
      return res.status(400).json({ message: 'Season must be at least 1' });
    }
    if (episode && episode < 1) {
      return res.status(400).json({ message: 'Episode must be at least 1' });
    }
  }

  try {
    // Check for spam prevention (5-min cooldown between posts)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentPost = await Post.findOne({
      user: req.user.id,
      createdAt: { $gt: fiveMinutesAgo }
    }).sort({ createdAt: -1 });

    if (recentPost) {
      const timeLeft = Math.ceil((recentPost.createdAt.getTime() + 5 * 60 * 1000 - Date.now()) / 1000 / 60);
      return res.status(429).json({ 
        message: `Please wait ${timeLeft} minute${timeLeft > 1 ? 's' : ''} before posting again to prevent spam.` 
      });
    }

    let userImageUrl = '';
    
    // Check if file was uploaded
    if (req.file) {
      userImageUrl = req.file.path || req.file.url || '';
    }

    const post = await Post.create({
      user: req.user.id,
      tmdbId,
      mediaTitle,
      posterPath,
      userImage: userImageUrl,
      content,
      isSpoiler: isSpoiler === 'true' || isSpoiler === true,
      mediaType,
      season: mediaType === 'tv' ? season : undefined,
      episode: mediaType === 'tv' ? episode : undefined,
    });

    res.status(201).json(post);
  } catch (error) {
    // Handle Cloudinary-specific errors
    if (error.message.includes('File size too large')) {
      return res.status(400).json({ message: 'Image file is too large. Maximum size is 10MB.' });
    }
    if (error.message.includes('image files')) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Failed to create post. Please try again.' });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check ownership
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Use deleteOne instead of remove
    await post.deleteOne();

    res.json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all posts for a specific TMDB ID (V8.0: The Movie Hub)
// @route   GET /api/posts/media/:tmdbId
// @access  Private
const getPostsByMedia = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    
    const posts = await Post.find({ tmdbId })
      .sort({ createdAt: -1 }) // Latest first
      .populate('user', 'username userImage role'); // Include role for badges
      
    const count = await Post.countDocuments({ tmdbId });

    res.json({ count, posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPosts, createPost, deletePost, getPostsByMedia };