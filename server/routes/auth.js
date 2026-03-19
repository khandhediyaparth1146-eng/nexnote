const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_for_nexnote';

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, passwordHash });
        const savedUser = await newUser.save();

        const token = jwt.sign({ id: savedUser._id, username: savedUser.username }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: { id: savedUser._id, username: savedUser.username, email: savedUser.email }
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ error: 'No token' });
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-passwordHash');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

// GET /api/auth/profile/:id
router.get('/profile/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('username bio followers following publicNotesCount createdAt topicsOfInterest');
        if (!user) return res.status(404).json({ error: 'Author not found' });

        // Check if current user is following this author
        let isFollowing = false;
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (token) {
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                isFollowing = user.followers.some(f => f.toString() === decoded.id);
            } catch (err) {
                // Ignore invalid token
            }
        }

        const Note = require('../models/Note');
        const notes = await Note.find({ authorId: req.params.id, visibility: 'public' }).sort({ createdAt: -1 });
        res.json({ user, notes, isFollowing });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/auth/follow/:id
router.post('/follow/:id', auth, async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            return res.status(400).json({ error: 'You cannot follow yourself' });
        }

        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToFollow) return res.status(404).json({ error: 'User not found' });

        if (userToFollow.followers.includes(req.user.id)) {
            return res.status(400).json({ error: 'You are already following this user' });
        }

        userToFollow.followers.push(req.user.id);
        currentUser.following.push(req.params.id);

        await userToFollow.save();
        await currentUser.save();

        res.json({ message: 'Successfully followed' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/auth/unfollow/:id
router.post('/unfollow/:id', auth, async (req, res) => {
    try {
        const userToUnfollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToUnfollow) return res.status(404).json({ error: 'User not found' });

        userToUnfollow.followers = userToUnfollow.followers.filter(f => f.toString() !== req.user.id);
        currentUser.following = currentUser.following.filter(f => f.toString() !== req.params.id);

        await userToUnfollow.save();
        await currentUser.save();

        res.json({ message: 'Successfully unfollowed' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/auth/profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { username, bio, password } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ error: 'User not found' });

        if (username && username !== user.username) {
            const existing = await User.findOne({ username });
            if (existing) return res.status(400).json({ error: 'Username already taken' });
            user.username = username;
        }

        if (bio !== undefined) user.bio = bio;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.passwordHash = await bcrypt.hash(password, salt);
        }

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
