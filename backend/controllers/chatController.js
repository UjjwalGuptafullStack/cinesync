const Message = require('../models/Message');

// @desc    Send a message
// @route   POST /api/chat
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    
    const message = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      content
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username userImage')
      .populate('receiver', 'username userImage');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get conversation between me and another user
// @route   GET /api/chat/:userId
// @access  Private
const getConversation = async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    
    // Find messages where (Sender is Me AND Receiver is Them) OR (Sender is Them AND Receiver is Me)
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user.id }
      ]
    })
    .sort({ createdAt: 1 }) // Oldest first (like WhatsApp)
    .populate('sender', 'username userImage');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getConversation };
