const Message = require('../models/Message');

// @desc    Send a message
// @route   POST /api/chat
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, image } = req.body;
    
    const message = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      content: content || "", // Empty string if only image sent
      image: image || undefined // Only save if provided
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
    .populate('sender', 'username userImage')
    .populate('receiver', 'username userImage'); // CRITICAL: Must populate receiver too for ChatPage header

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get list of users I have chatted with (Inbox)
// @route   GET /api/chat/inbox
// @access  Private
const getInbox = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all messages where I am sender OR receiver
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
    .sort({ createdAt: -1 }) // Newest first
    .populate('sender', 'username userImage')
    .populate('receiver', 'username userImage');

    // Extract unique conversation partners
    const conversationMap = new Map();

    messages.forEach(msg => {
      // Determine who the "other" person is
      const otherUser = msg.sender._id.toString() === userId ? msg.receiver : msg.sender;
      const otherId = otherUser._id.toString();

      // If we haven't seen this person yet, add them (this keeps the most recent message due to sort)
      if (!conversationMap.has(otherId)) {
        conversationMap.set(otherId, {
          user: otherUser,
          lastMessage: msg.content,
          timestamp: msg.createdAt,
          isRead: msg.read || msg.sender._id.toString() === userId // Read if I sent it or marked read
        });
      }
    });

    const inbox = Array.from(conversationMap.values());
    res.json(inbox);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getConversation, getInbox };
