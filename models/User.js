const mongoose = require('mongoose');


const UserSchema = mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['provider', 'customer', 'admin'],
        required: true
    },
    isVerified : {
        type: Boolean,
        default: false
    },
    profileUpdated: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    resetToken : String,
    verifyToken: String,
    resetTokenExpiry: Date,
    tokenVersion: {
        type: Number,
        default: 0
    }

})
module.exports = mongoose.model('User', UserSchema);