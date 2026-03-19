const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    // Friend Group System
    name: { type: String, required: true },
    description: { type: String, default: '' },
    groupType: {
        type: String,
        enum: ['Study Group', 'Project Team', 'Research Group', 'Other'],
        default: 'Study Group'
    },

    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Members with Specific Permissions
    members: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'viewer' }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);
