const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServiceSchema = new Schema({
  providerId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming your user model is named 'User'
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: String, // Using String to allow for flexible formatting like "50 GHS", "Contact for price"
                 // Could also be Number if strict numerical input is enforced and currency handled separately
    required: true
  },
  category: { // E.g., "Plumbing", "Electrical", "Tutoring"
    type: String,
    trim: true
  },
  // duration: { // Optional: e.g., "1 hour", "30 minutes per session"
  //   type: String,
  //   trim: true
  // },
  isActive: { // To allow providers to temporarily disable a service
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Service', ServiceSchema);
