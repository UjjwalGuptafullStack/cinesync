const User = require('../models/User');
const FriendRequest = require('../models/FriendRequest');
const Notification = require('../models/Notification');
const Post = require('../models/Post');

// @desc    Search for users by username
// @route   GET /api/social/search?query=john
// @access  Private
const searchUsers = async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ message: 'Query required' });

  try {
    // Find users where username contains the query (case insensitive)
    // $ne: req.user.id -> Don't show myself in results
    const users = await User.find({
      username: { $regex: query, $options: 'i' },
      _id: { $ne: req.user.id }, 
    }).select('username userImage _id'); // Return ID, Username, and Profile Picture

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a follow request
// @route   POST /api/social/follow/:id
// @access  Private
const sendRequest = async (req, res) => {
  const receiverId = req.params.id;
  const senderId = req.user.id;

  try {
    // Check if already following
    const sender = await User.findById(senderId);
    if (sender.tracking.includes(receiverId)) {
      return res.status(400).json({ message: 'You are already following this user' });
    }

    // Check for existing pending request
    const pendingRequest = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: 'pending',
    });

    if (pendingRequest) {
      return res.status(400).json({ 
        message: 'Request already sent. Please wait for the user to respond.' 
      });
    }

    // Check for recently rejected request (within last 15 minutes)
    const rejectedRequest = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: 'rejected',
    }).sort({ updatedAt: -1 });

    if (rejectedRequest) {
      const now = new Date();
      const timeSinceRejection = (now - rejectedRequest.updatedAt) / 1000 / 60; // minutes
      
      if (timeSinceRejection < 15) {
        const minutesLeft = Math.ceil(15 - timeSinceRejection);
        return res.status(400).json({ 
          message: `Please wait ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''} before sending another request to this user.` 
        });
      } else {
        // Cooldown expired, delete old rejected request
        await FriendRequest.findByIdAndDelete(rejectedRequest._id);
      }
    }

    // Create the follow request
    await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
    });

    // Create notification for receiver
    await Notification.create({
      recipient: receiverId,
      sender: senderId,
      type: 'follow_request',
      read: false
    });

    res.status(200).json({ message: 'Follow request sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my pending requests (People who want to follow ME)
// @route   GET /api/social/requests
// @access  Private
const getRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({
      receiver: req.user.id,
      status: 'pending',
    }).populate('sender', 'username userImage'); // Get the sender's username and profile picture

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept a follow request
// @route   POST /api/social/accept/:id
// @access  Private
const acceptRequest = async (req, res) => {
  const requestId = req.params.id;

  try {
    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.receiver.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update sender's tracking list (they can now see receiver's posts)
    await User.findByIdAndUpdate(request.sender, {
      $push: { tracking: req.user.id },
    });

    // Update receiver's audience list (receiver knows this person follows them)
    await User.findByIdAndUpdate(req.user.id, {
      $push: { audience: request.sender },
    });

    // Delete the request
    await FriendRequest.findByIdAndDelete(requestId);

    // Send notification to original sender that request was accepted
    await Notification.create({
      recipient: request.sender,
      sender: req.user.id,
      type: 'follow_accepted',
      read: false
    });

    res.json({ message: 'Request accepted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject a follow request
// @route   POST /api/social/reject/:id
// @access  Private
const rejectRequest = async (req, res) => {
  const requestId = req.params.id;

  try {
    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.receiver.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update status to rejected (keeps the record for cooldown tracking)
    request.status = 'rejected';
    await request.save();

    // Send notification to original sender that request was rejected
    await Notification.create({
      recipient: request.sender,
      sender: req.user.id,
      type: 'follow_rejected',
      read: false
    });

    res.json({ message: 'Request rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Suggested Connections (Friends of Friends)
// @route   GET /api/social/suggestions
// @access  Private
const getSuggestions = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 1. Get My Tracking List
    const me = await User.findById(userId).populate('tracking');
    const myTrackingIds = me.tracking.map(u => u._id.toString());
    
    // 2. Find "Candidates": People followed by the people I follow
    let candidateIds = new Set();
    
    // Fetch the 'tracking' list of everyone I follow
    const myFriends = await User.find({ _id: { $in: myTrackingIds } });
    
    myFriends.forEach(friend => {
      friend.tracking.forEach(id => {
        const idStr = id.toString();
        // Exclude myself and people I already follow
        if (idStr !== userId && !myTrackingIds.includes(idStr)) {
          candidateIds.add(idStr);
        }
      });
    });

    // 3. Fetch Details for Candidates
    const candidates = await User.find({ _id: { $in: Array.from(candidateIds) } })
      .select('username userImage')
      .limit(10);

    // 4. Build "Cards" with Top 3 Library Items
    const suggestions = await Promise.all(candidates.map(async (user) => {
      // Fetch latest posts for this user to build Top 3
      const posts = await Post.find({ user: user._id })
        .sort({ createdAt: -1 })
        .limit(20);

      const uniqueLibrary = [];
      const seenTmdb = new Set();

      for (let p of posts) {
        if (!seenTmdb.has(p.tmdbId) && p.posterPath) {
          seenTmdb.add(p.tmdbId);
          uniqueLibrary.push(p.posterPath);
        }
        if (uniqueLibrary.length === 3) break;
      }

      return {
        _id: user._id,
        username: user.username,
        libraryPreviews: uniqueLibrary,
        mutuals: 1
      };
    }));

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { searchUsers, sendRequest, getRequests, acceptRequest, rejectRequest, getSuggestions };
