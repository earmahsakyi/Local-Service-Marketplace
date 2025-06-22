const Activity = require('../models/Activity'); // Adjust path if your models folder is elsewhere

/**
 * Records an activity for a user.
 * @param {string} userId - The ID of the user this activity pertains to.
 * @param {string} type - The type of activity (should match enum values in ActivitySchema).
 * @param {string} message - A human-readable message describing the activity.
 * @param {string} [relatedEntityId=null] - Optional ID of an entity related to this activity.
 * @param {string} [relatedEntityType=null] - Optional type of the related entity.
 */
const recordActivity = async (userId, type, message, relatedEntityId = null, relatedEntityType = null) => {
  try {
    const newActivity = new Activity({
      userId,
      type,
      message,
      relatedEntityId,
      relatedEntityType
    });
    await newActivity.save();
    // console.log(`Activity recorded: ${type} for user ${userId}`); // Optional: for server logging
  } catch (error) {
    console.error('Error recording activity:', error);
    // Depending on requirements, you might want to throw the error
    // or handle it more robustly (e.g., retry, or log to a dedicated error service)
  }
};

module.exports = {
  recordActivity
};
