const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');

// --- POST INTERACTIONS ---

// @desc    Toggle Like on Post
// @route   PUT /api/posts/:id/like
const togglePostLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Remove from dislikes if present
    if (post.dislikes.includes(req.user.id)) {
      post.dislikes = post.dislikes.filter(id => id.toString() !== req.user.id);
    }

    // Toggle Like
    if (post.likes.includes(req.user.id)) {
      post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
      
      // SEND NOTIFICATION (If not liking own post)
      if (post.user.toString() !== req.user.id) {
        await Notification.create({
          recipient: post.user,
          sender: req.user.id,
          type: 'like',
          post: post._id
        });
      }
    }

    await post.save();
    res.json(post.likes); // Return updated list
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle Dislike on Post
// @route   PUT /api/posts/:id/dislike
const togglePostDislike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    // Remove from likes if present
    if (post.likes.includes(req.user.id)) {
      post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    }

    // Toggle Dislike
    if (post.dislikes.includes(req.user.id)) {
      post.dislikes = post.dislikes.filter(id => id.toString() !== req.user.id);
    } else {
      post.dislikes.push(req.user.id);
    }

    await post.save();
    res.json(post.dislikes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- COMMENT SYSTEM ---

// @desc    Add a Comment
// @route   POST /api/posts/:id/comment
const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    const comment = await Comment.create({
      post: req.params.id,
      user: req.user.id,
      content,
    });

    // Notify Post Owner
    if (post.user.toString() !== req.user.id) {
      await Notification.create({
        recipient: post.user,
        sender: req.user.id,
        type: 'comment',
        post: post._id
      });
    }

    // Return comment with user info populated
    const populatedComment = await Comment.findById(comment._id).populate('user', 'username');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Comments for a Post
// @route   GET /api/posts/:id/comments
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- COMMENT INTERACTIONS ---

// @desc    Toggle Like on Comment
// @route   PUT /api/comments/:id/like
const toggleCommentLike = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (comment.dislikes.includes(req.user.id)) {
        comment.dislikes = comment.dislikes.filter(id => id.toString() !== req.user.id);
    }
    
    if (comment.likes.includes(req.user.id)) {
        comment.likes = comment.likes.filter(id => id.toString() !== req.user.id);
    } else {
        comment.likes.push(req.user.id);
    }
    
    await comment.save();
    res.json(comment.likes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle Dislike on Comment
// @route   PUT /api/comments/:id/dislike
const toggleCommentDislike = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (comment.likes.includes(req.user.id)) {
        comment.likes = comment.likes.filter(id => id.toString() !== req.user.id);
    }

    if (comment.dislikes.includes(req.user.id)) {
        comment.dislikes = comment.dislikes.filter(id => id.toString() !== req.user.id);
    } else {
        comment.dislikes.push(req.user.id);
    }
    
    await comment.save();
    res.json(comment.dislikes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- NOTIFICATIONS ---
const getNotifications = async (req, res) => {
    try {
        const notifs = await Notification.find({ recipient: req.user.id })
            .populate('sender', 'username')
            .populate('post', 'mediaTitle')
            .sort({ createdAt: -1 })
            .limit(20); // Limit to 20 recent notifications
        res.json(notifs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check ownership
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await comment.deleteOne();

    res.json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  togglePostLike,
  togglePostDislike,
  addComment,
  getComments,
  toggleCommentLike,
  toggleCommentDislike,
  getNotifications,
  deleteComment
};
