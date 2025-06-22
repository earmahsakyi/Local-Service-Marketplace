const mongoose = require('mongoose');

const CustomerSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
 fullName: {
    type: String,
    required: true

  },
    Phone: {
    type: String,
    required: true

  },
 location: {
  city: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  town: {
    type: String,
    required: true
  }
}
},{ timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);
