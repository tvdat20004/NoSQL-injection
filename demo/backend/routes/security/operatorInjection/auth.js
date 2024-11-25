const express = require('express');
const router = express.Router();
const User = require('../../vulnerable/operatorInjection/User');
const ROUTES = require('./constants');

// Middleware kiểm tra NoSQL Injection
const checkNoSQLInjection = (obj) => {
    // Chuyển object thành string để kiểm tra
    const str = JSON.stringify(obj);
    // Kiểm tra các MongoDB operators
    const hasOperators = str.includes('$') || 
                        str.includes('{') || 
                        str.includes('}') ||
                        str.includes('regex');
    return hasOperators;
};

// Login route với bảo vệ
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Kiểm tra injection
        if (checkNoSQLInjection(username) || checkNoSQLInjection(password)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid input'
            });
        }

        // Đảm bảo username và password là string
        if (typeof username !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid input format'
            });
        }

        // Query với điều kiện chính xác
        const user = await User.findOne({
            username: username,
            password: password
        });
        console.log(user);
        if (user) {
            // Tạo session token
            const sessionToken = Buffer.from(JSON.stringify({
                username: user.username,
                role: user.role,
                timestamp: Date.now()
            })).toString('base64');

            // Set cookie
            res.setHeader('Set-Cookie', `session=${sessionToken}; Path=/; HttpOnly`);

            if (user.role === 'admin') {
                res.json({
                    success: true,
                    role: 'admin',
                    message: 'Admin login successful',
                    redirectUrl: ROUTES.ADMIN
                });
            } else {
                res.json({
                    success: true,
                    role: 'user',
                    message: 'User login successful',
                    redirectUrl: ROUTES.USER
                });
            }
        } else {
            // Delay ngẫu nhiên để chống brute force
            await new Promise(resolve => setTimeout(resolve, Math.random() * 500));
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Route kiểm tra quyền admin
router.get('/check-admin', (req, res) => {
    try {
        const sessionCookie = req.cookies.session;
        if (!sessionCookie) {
            return res.status(401).json({ success: false, message: 'No session found' });
        }

        const sessionData = JSON.parse(Buffer.from(sessionCookie, 'base64').toString());
        
        // Kiểm tra timestamp
        const now = Date.now();
        const sessionAge = now - sessionData.timestamp;
        if (sessionAge > 24 * 60 * 60 * 1000) { // 24 hours
            res.clearCookie('session');
            return res.status(401).json({ success: false, message: 'Session expired' });
        }

        if (sessionData.role === 'admin') {
            res.json({ success: true, message: 'Valid admin session' });
        } else {
            res.status(403).json({ success: false, message: 'Not authorized' });
        }
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid session' });
    }
});

module.exports = router;