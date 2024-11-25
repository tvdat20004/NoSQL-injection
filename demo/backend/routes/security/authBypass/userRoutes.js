// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../../../users');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Middleware để validate và sanitize search query
const sanitizeQuery = (req, res, next) => {
    const allowedOperators = ['username', 'email'];
    const allowedComparison = ['$eq', '$regex'];
    
    try {
        const query = req.body.query;
        
        // Kiểm tra nếu query là object
        if (typeof query !== 'object' || query === null) {
            throw new Error('Invalid query format');
        }

        // Kiểm tra các operators
        Object.keys(query).forEach(key => {
            // Chỉ cho phép một số trường nhất định
            if (!allowedOperators.includes(key)) {
                throw new Error(`Operator ${key} không được phép sử dụng`);
            }

            // Nếu giá trị là object (có thể là MongoDB operator)
            if (typeof query[key] === 'object') {
                Object.keys(query[key]).forEach(op => {
                    if (!allowedComparison.includes(op)) {
                        throw new Error(`Comparison operator ${op} không được phép sử dụng`);
                    }
                });
            }
        });

        // Luôn đảm bảo chỉ hiển thị những user không bị ẩn
        req.sanitizedQuery = {
            ...query,
            isHidden: false,
        };

        next();
    } catch (error) {
        res.status(400).json({ 
            error: 'Invalid query',
            message: 'Chỉ được phép tìm kiếm theo username'
        });
    }
};

// Middleware để mã hóa sensitive data
const encryptSensitiveData = (user) => {
    if (!user) return null;
    
    // Tạo bản sao của user object để không ảnh hưởng đến dữ liệu gốc
    const sanitizedUser = { ...user.toObject() };

    // Loại bỏ các trường nhạy cảm
    delete sanitizedUser.password;
    delete sanitizedUser.__v;
    delete sanitizedUser.isHidden;
    
    // Mã hóa email
    if (sanitizedUser.email) {
        const [username, domain] = sanitizedUser.email.split('@');
        sanitizedUser.email = `${username.slice(0, 2)}***@${domain}`;
    }

    // Mã hóa các trường nhạy cảm khác nếu cần
    if (sanitizedUser.role === 'admin') {
        sanitizedUser.role = '***';
    }

    return sanitizedUser;
};

// Routes
router.get('/users/dashboard', async (req, res) => {
    try {
        const users = await User.find({ isHidden: false })
            .select('-password -__v')
            .sort({ createdAt: -1 });
        
        // Mã hóa dữ liệu nhạy cảm trước khi gửi
        const sanitizedUsers = users.map(encryptSensitiveData);
        
        res.status(200).json(sanitizedUsers);
    } catch (err) {
        res.status(500).json({ 
            message: "Error fetching users", 
            error: "Internal server error"  // Không trả về chi tiết lỗi
        });
    }
});

// Secure search endpoint
router.post('/search', sanitizeQuery, async (req, res) => {
    try {
        const users = await User.find(req.sanitizedQuery)
            .select('-password -__v')
            .sort({ createdAt: -1 });

        // Mã hóa dữ liệu nhạy cảm trước khi gửi
        const sanitizedUsers = users.map(encryptSensitiveData);
        
        res.json(sanitizedUsers);
    } catch (error) {
        res.status(500).json({ 
            message: "Search failed",
            error: "Internal server error"
        });
    }
});

module.exports = router;