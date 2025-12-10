const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Who gets the notif
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Who did the action
    type: { type: String, enum: ['like', 'comment', 'follow'], required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, // Optional (for likes/comments)
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
