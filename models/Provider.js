const mongoose = require('mongoose');

const ProviderSchema =  mongoose.Schema({
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
  phone: {
    type: String,
    required: true

  },

  title: { 
    type: String,
    required : true
},

  location: {
    city: String,
    region: String,
    town: String
  },
  services: {
    type: [String],
    required: true
  },

  description: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    default: '', 
    required: true
  }
},{ timestamps: true });

module.exports = mongoose.model('Provider', ProviderSchema);
