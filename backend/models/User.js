const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please add a username'],
      unique: true,
      index: true, // ⚡ Speed up username lookups
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      index: true, // ⚡ Speed up email searches
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    userImage: {
      type: String,
      default: '',
    },
    // Email Verification (Google OAuth users are auto-verified)
    isVerified: {
      type: Boolean,
      default: false,
    },
    // V8.0: Account Type (User vs Production House)
    role: {
      type: String,
      enum: ['user', 'production'],
      default: 'user',
      index: true, // ⚡ Speed up production house queries
    },
    // V8.0: Library/Filmography (TMDB IDs)
    library: [{ type: String }], // For users: watched content, For studios: filmography
    // RENAMED: Social Graph (Tracking & Audience)
    audience: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Formerly 'followers'
    tracking: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Formerly 'following'
  },
  {
    timestamps: true, // Automatically creates 'createdAt' and 'updatedAt' fields
  }
);

module.exports = mongoose.model('User', userSchema);
