const User = require('../models/User');
const FriendRequest = require('../models/FriendRequest');

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
    }).select('username _id'); // Only return ID and Username

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
    // 1. Check if already following
    const sender = await User.findById(senderId);
    if (sender.following.includes(receiverId)) {
      return res.status(400).json({ message: 'You are already following this user' });
    }

    // 2. Check if request already exists
    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: 'pending',
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    // 3. Create Request
    await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
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
    }).populate('sender', 'username'); // Get the sender's username

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept a follow request
// @route   POST /api/social/accept/:id
// @access  Private
const acceptRequest = async (req, res) => {
  const requestId = req.params.id; // This is the ID of the REQUEST, not the user

  try {
    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.receiver.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // 1. Update Sender's 'following' list
    await User.findByIdAndUpdate(request.sender, {
      $push: { following: req.user.id },
    });

    // 2. Update Receiver's (My) 'followers' list
    await User.findByIdAndUpdate(req.user.id, {
      $push: { followers: request.sender },
    });

    // 3. Delete the request (or mark accepted)
    await FriendRequest.findByIdAndDelete(requestId);

    res.json({ message: 'Request accepted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { searchUsers, sendRequest, getRequests, acceptRequest };
