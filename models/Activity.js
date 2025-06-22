const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
  userId: { // The user this activity pertains to (e.g., the provider)
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Index for faster querying of user-specific activities
  },
  type: { // Type of activity
    type: String,
    required: true,
    enum: [
      'SERVICE_CREATED',
      'SERVICE_UPDATED',
      'SERVICE_DELETED',
      'PROFILE_UPDATED',
      'BOOKING_REQUEST',    // Future use
      'BOOKING_CONFIRMED',  // Future use
      'BOOKING_CANCELLED',  // Future use
      'REVIEW_NEW',         // Future use
      'ACCOUNT_VERIFIED',
      'GENERAL_NOTIFICATION'
      // Add more specific types as your application evolves
    ]
  },
  message: { // A human-readable message describing the activity
    type: String,
    required: true,
    trim: true
  },
  relatedEntityId: { // Optional: ID of an entity related to this activity (e.g., Service ID, Booking ID)
    type: Schema.Types.ObjectId,
    default: null
  },
  relatedEntityType: { // Optional: Type of the related entity (e.g., 'Service', 'Booking', 'User')
    type: String,
    trim: true,
    default: null
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true // Index for querying read/unread activities
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Activity', ActivitySchema);
