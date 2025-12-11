const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');

// Load environment variables
dotenv.config();

const clearDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Delete all collections
    const deletedPosts = await Post.deleteMany({});
    console.log(`🗑️  Deleted ${deletedPosts.deletedCount} posts`);

    const deletedComments = await Comment.deleteMany({});
    console.log(`🗑️  Deleted ${deletedComments.deletedCount} comments`);

    const deletedNotifications = await Notification.deleteMany({});
    console.log(`🗑️  Deleted ${deletedNotifications.deletedCount} notifications`);

    const deletedUsers = await User.deleteMany({});
    console.log(`🗑️  Deleted ${deletedUsers.deletedCount} users`);

    console.log('\n✨ Database cleared successfully!');
    
    // Close connection
    await mongoose.connection.close();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
};

// Run the script
clearDatabase();
