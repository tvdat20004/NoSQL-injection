const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logger = require('../utils/logger');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Debug log
        console.log('Login attempt:', { username });

        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Debug log
        console.log('User found:', { userId: user._id, isAdmin: user.isAdmin });

        // Kiểm tra password
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            console.log('Invalid password');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            config.jwt_secret,
            { expiresIn: '24h' }
        );

        // Debug log
        console.log('Login successful, token generated');

        res.json({ 
            token,
            user: {
                id: user._id,
                username: user.username,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};