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
      unique: true,
      sparse: true, // Allows multiple nulls for ghost accounts
      index: true, // ⚡ Speed up email searches
    },
    password: {
      type: String, // Optional for ghost accounts
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
      enum: ['user', 'production', 'admin'],
      default: 'user',
      index: true, // ⚡ Speed up production house queries
    },
    // V8.6: Ghost Account System
    isClaimed: {
      type: Boolean,
      default: true, // True for normal users, False for Ghost Studios
    },
    tmdbCompanyId: {
      type: String,
      unique: true,
      sparse: true, // Allows nulls, e.g., "174" for Warner Bros
      index: true,
    },
    website: {
      type: String,
    },
    claimToken: {
      type: String, // Secure token for claiming ghost accounts
    },
    // V8.0: Library/Filmography (TMDB IDs)
    library: [{ type: String }], // For users: watched content, For studios: filmography
    // RENAMED: Social Graph (Tracking & Audience)
    audience: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Formerly 'followers'
    tracking: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Formerly 'following'
    // V8.3: Online Status
    lastActive: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Automatically creates 'createdAt' and 'updatedAt' fields
  }
);

module.exports = mongoose.model('User', userSchema);
