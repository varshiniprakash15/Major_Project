const mongoose = require('mongoose');
const User = require('./server/models/User');
require('dotenv').config();

async function clearDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agrolink');
        console.log('Connected to MongoDB');

        // Clear all users
        await User.deleteMany({});
        console.log('Cleared all users from database');

        console.log('Database cleared successfully!');
    } catch (error) {
        console.error('Error clearing database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

clearDatabase();
