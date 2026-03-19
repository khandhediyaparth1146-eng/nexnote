const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const Group = require('../models/Group');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all notes for a user
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const visibilityFilter = req.query.visibility;

        // User can see:
        // 1. Their own notes
        // 2. Shared notes they are given access to
        // 3. Public notes (these are mostly in explore, but let's allow fetching by visibility here too)

        // Find user's groups
        const userGroups = await Group.find({ 'members.user': userId }).select('_id');
        const groupIds = userGroups.map(g => g._id);

        let query = {};

        if (visibilityFilter === 'shared') {
            query = {
                $or: [
                    { authorId: userId, visibility: 'shared' },
                    { sharedWithGroups: { $in: groupIds }, visibility: 'shared' }
                ]
            };
        } else if (visibilityFilter === 'public') {
            query = { authorId: userId, visibility: 'public' };
        } else if (visibilityFilter === 'private') {
            query = { authorId: userId, visibility: 'private' };
        } else {
            // 'all' or no filter
            query = {
                $or: [
                    { authorId: userId },
                    { sharedWithGroups: { $in: groupIds }, visibility: 'shared' }
                ]
            };
        }

        const notes = await Note.find(query).sort({ updatedAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create note
router.post('/', auth, async (req, res) => {
    try {
        const newNote = new Note({
            title: req.body.title || '',
            content: req.body.content || '',
            tags: req.body.tags || [],
            categories: req.body.categories || [],
            visibility: req.body.visibility || 'private',
            authorId: req.user.id,
            sharedWithGroups: req.body.sharedWithGroups || []
        });

        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    } catch (err) {
        console.error('Note creation error:', err);
        res.status(500).json({ error: 'Failed to create note' });
    }
});

// Update note
router.put('/:id', auth, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ error: 'Note not found' });

        // Verify ownership
        if (note.authorId.toString() !== req.user.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(updatedNote);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update note' });
    }
});

// Delete note
router.delete('/:id', auth, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ error: 'Note not found' });

        if (note.authorId.toString() !== req.user.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        await Note.findByIdAndDelete(req.params.id);
        res.json({ message: 'Note deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Explore (Public Notes) 
router.get('/explore/public', async (req, res) => {
    try {
        const notes = await Note.find({ visibility: 'public' })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('authorId', 'username email');
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Following Feed
router.get('/explore/following', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('following');
        if (!user) return res.status(404).json({ error: 'User not found' });

        const notes = await Note.find({
            authorId: { $in: user.following },
            visibility: 'public'
        })
            .sort({ createdAt: -1 })
            .populate('authorId', 'username email');

        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Clone/Save a public note to user's workspace
router.post('/:id/save', auth, async (req, res) => {
    try {
        const originalNote = await Note.findById(req.params.id);
        if (!originalNote) return res.status(404).json({ error: 'Original note not found' });
        if (originalNote.visibility !== 'public') return res.status(403).json({ error: 'Note is not public' });

        const clonedNote = new Note({
            title: `Copy of: ${originalNote.title}`,
            content: originalNote.content,
            tags: originalNote.tags,
            categories: originalNote.categories,
            visibility: 'private',
            authorId: req.user.id
        });

        const savedNote = await clonedNote.save();
        res.status(201).json(savedNote);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save note to workspace' });
    }
});

module.exports = router;
