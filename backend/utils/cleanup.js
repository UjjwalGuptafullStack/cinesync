const FriendRequest = require('../models/FriendRequest');

/**
 * Clean up rejected friend requests older than 15 minutes
 * This prevents the database from accumulating old rejected requests
 */
const cleanupOldRejectedRequests = async () => {
  try {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    
    const result = await FriendRequest.deleteMany({
      status: 'rejected',
      updatedAt: { $lt: fifteenMinutesAgo }
    });

    if (result.deletedCount > 0) {
      console.log(`🧹 Cleaned up ${result.deletedCount} old rejected friend requests`);
    }
  } catch (error) {
    console.error('Error cleaning up old requests:', error);
  }
};

// Run cleanup every 5 minutes
const startCleanupJob = () => {
  cleanupOldRejectedRequests(); // Run immediately on start
  setInterval(cleanupOldRejectedRequests, 5 * 60 * 1000); // Then every 5 minutes
  console.log('🔄 Friend request cleanup job started (runs every 5 minutes)');
};

module.exports = { cleanupOldRejectedRequests, startCleanupJob };
