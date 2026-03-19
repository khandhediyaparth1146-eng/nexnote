const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUsers() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/nexnote');
        const users = await User.find({});
        console.log('Total users:', users.length);
        if (users.length > 0) {
            console.log('User emails:', users.map(u => u.email));
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUsers();
