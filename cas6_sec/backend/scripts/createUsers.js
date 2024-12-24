const User = require('../models/User');
const logger = require('../utils/logger');
const bcrypt = require('bcrypt');
require('../config/database');

const users = [
    {
        username: 'admin',
        password: 'Admin@123', 
        email: 'admin@example.com',
        isAdmin: true,
        accountStatus: 'active'
    },
    {
        username: 'user1',
        password: 'User1@123',
        email: 'user1@example.com',
        isAdmin: false,
        accountStatus: 'active'
    }
];

async function createUsers() {
    try {
        await User.deleteMany({});

        for (const userData of users) {
            // Hash password trực tiếp
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);
            
            const user = await User.create({
                ...userData,
                password: hashedPassword
            });
            logger.info(`Created user: ${user.username} (${user.isAdmin ? 'admin' : 'user'})`);
        }

        const createdUsers = await User.find({}).select('-password');
        console.log('Created users:', createdUsers);
        
        logger.info('Users created successfully');
        process.exit(0);
    } catch (error) {
        logger.error('Error creating users:', error);
        process.exit(1);
    }
}

// Đợi kết nối database
const mongoose = require('mongoose');
mongoose.connection.once('open', () => {
    console.log('MongoDB connected, creating users...');
    createUsers();
});