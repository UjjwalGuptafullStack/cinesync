const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // This links the post to the User model
    },
    // Media Details (Cached from TMDB so we don't have to fetch again)
    tmdbId: { type: String, required: true },
    mediaTitle: { type: String, required: true },
    posterPath: { type: String },
    
    // User Content
    content: { type: String, required: [true, 'Please add some text'] },
    isSpoiler: { type: Boolean, default: false },

    // NEW: Smart Context Fields
    mediaType: { 
      type: String, 
      enum: ['movie', 'tv'], // Only allow these two values
      required: true 
    },
    season: { type: Number }, // Optional (only for TV)
    episode: { type: Number }, // Optional (only for TV)
  },
  {
    timestamps: true, // Auto-create createdAt/updatedAt
  }
);

module.exports = mongoose.model('Post', postSchema);
