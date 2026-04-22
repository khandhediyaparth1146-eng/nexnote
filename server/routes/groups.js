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
        res.status(500).json({ error: 'Server error' });
    }
});

// Join a group
router.post('/:id/join', auth, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ error: 'Circle not found' });

        const isMember = group.members.some(m => m.user.toString() === req.user.id);
        if (isMember) return res.status(400).json({ error: 'You are already in this circle' });

        group.members.push({ user: req.user.id, role: 'member' });
        await group.save();
        
        const updatedGroup = await Group.findById(req.params.id).populate('members.user', 'username');
        res.json(updatedGroup);
    } catch (err) {
        res.status(500).json({ error: 'Failed to join circle' });
    }
});

module.exports = router;
