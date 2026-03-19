const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function seedUser() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/nexnote');

        let testUser = await User.findOne({ email: 'test@example.com' });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password123', salt);

        if (testUser) {
            testUser.passwordHash = passwordHash;
            console.log('Updating existing test user password...');
        } else {
            testUser = new User({
                username: 'testuser',
                email: 'test@example.com',
                passwordHash: passwordHash,
                bio: 'I am a test user for NexNote'
            });
            console.log('Creating new test user...');
        }

        await testUser.save();
        console.log('✅ Test user created:');
        console.log('Email: test@example.com');
        console.log('Password: password123');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding user:', err);
        process.exit(1);
    }
}

seedUser();
