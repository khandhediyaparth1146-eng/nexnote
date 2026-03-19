const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: { type: String, default: '' },
    content: { type: String, default: '' },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // 6. Tag & Category Organization
    tags: [{ type: String }],
    categories: [{ type: String }],

    // 7, 8, 9, 10. Note Visibility Control
    visibility: {
        type: String,
        enum: ['private', 'shared', 'public'],
        default: 'private'
    },

    // 9. Shared Notes
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    sharedWithGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],

    // 11. Temporary Sharing
    expiresAt: { type: Date, default: null },

    // AI Smart Features (12, 13, 15, 16)
    aiCategories: [{ type: String }],
    aiKeywords: [{ type: String }],
    aiSummary: { type: String },
    aiSimplifiedVersion: { type: String },

    // 20. Idea Evolution Tracker (History of revisions)
    history: [{
        content: String,
        updatedAt: { type: Date, default: Date.now }
    }],

    // 28. Study Mode (Flashcards)
    flashcards: [{
        question: String,
        answer: String
    }]
}, { timestamps: true });

// 14. Semantic Search (mocking vector embeddings placeholder)
noteSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Note', noteSchema);
