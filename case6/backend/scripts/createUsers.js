const mongoose = require('mongoose');
const User = require('../models/User');

// Kết nối đến MongoDB
mongoose.connect('mongodb://localhost:27017/vulnerable_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Tạo user mặc định
const users = [
    {
        username: 'admin',
        password: 'admin123',
        isAdmin: true,
        token: '1234567890'
    },
    {
        username: 'user1',
        password: 'user123',
        isAdmin: false,
        token: '0987654321'
    },
    {
        username: 'user2',
        password: 'user456',
        isAdmin: false,
        token: '1122334455'
    }
];

// Hàm tạo users
async function createUsers() {
    try {
        // Xóa tất cả users hiện có
        await User.deleteMany({});
        
        // Tạo users mới
        for (const user of users) {
            await User.create(user);
            console.log(`Created user: ${user.username}`);
        }
        
        console.log('All users created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating users:', error);
        process.exit(1);
    }
}

createUsers();