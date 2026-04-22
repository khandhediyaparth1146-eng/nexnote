const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
    try {
        let uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nexnote';
        // If it's the default local URI and mongo isn't running, we spin up in-memory DB
        if (uri.includes('127.0.0.1') || uri.includes('localhost')) {
            console.log('🔄 Starting in-memory MongoDB server...');
            const mongoServer = await MongoMemoryServer.create();
            uri = mongoServer.getUri();
            await mongoose.connect(uri);
            console.log('📦 Connected to IN-MEMORY MongoDB');
        } else {
            await mongoose.connect(uri);
            console.log('📦 Connected to MongoDB');
        }
    } catch (err) {
        console.warn('⚠️ Could not connect to MongoDB:', err.message);
    }
};
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/groups', require('./routes/groups'));

// Health check
app.get('/api/health', (req, res) => {
    const isConnected = mongoose.connection.readyState === 1;
    res.json({ status: 'ok', database: isConnected ? 'connected' : 'disconnected' });
});


// ─── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 NexNote backend running on http://localhost:${PORT}`);
});
