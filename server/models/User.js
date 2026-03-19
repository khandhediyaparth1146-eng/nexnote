const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // 1. User Authentication
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },

    // Author Profile Features
    bio: { type: String, default: '' },
    topicsOfInterest: [{ type: String }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // Activity metrics
    publicNotesCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
