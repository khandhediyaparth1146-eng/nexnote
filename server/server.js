const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nexnote')
    .then(() => console.log('📦 Connected to MongoDB'))
    .catch(err => console.warn('⚠️ Could not connect to MongoDB:', err.message));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/groups', require('./routes/groups'));

// Health check
app.get('/api/health', (req, res) => {
    const isConnected = mongoose.connection.readyState === 1;
    res.json({ status: 'ok', database: isConnected ? 'connected' : 'disconnected' });
});

// Public Explore Route directly routed to notes
app.get('/api/explore', async (req, res) => {
    try {
        const Note = require('./models/Note');
        const notes = await Note.find({ visibility: 'public' })
            .populate('authorId', 'username')
            .sort({ createdAt: -1 });
        res.json(notes);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch public notes' });
    }
});

// ─── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 NexNote backend running on http://localhost:${PORT}`);
});
