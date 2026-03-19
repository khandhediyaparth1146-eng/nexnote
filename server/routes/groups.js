const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const auth = require('../middleware/auth');

// Get all groups user is a member of
router.get('/', auth, async (req, res) => {
    try {
        const groups = await Group.find({ 'members.user': req.user.id }).populate('members.user', 'username');
        res.json(groups);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a new group
router.post('/', auth, async (req, res) => {
    try {
        const { name, description, groupType } = req.body;

        const newGroup = new Group({
            name,
            description,
            groupType,
            creatorId: req.user.id,
            members: [{ user: req.user.id, role: 'admin' }]
        });

        const savedGroup = await newGroup.save();
        res.status(201).json(savedGroup);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create group' });
    }
});

module.exports = router;
