const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');
const logger = require('../utils/logger');

exports.authenticate = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const token = header.split(' ')[1];
        let decoded;
        
        try {
            decoded = jwt.verify(token, config.jwt_secret);
        } catch (err) {
            logger.warn('Invalid token:', err.message);
            return res.status(401).json({ error: 'Invalid token' });
        }

        const user = await User.findById(decoded.userId)
            .select('-password')
            .lean();

        if (!user || user.accountStatus !== 'active') {
            return res.status(401).json({ error: 'User not found or inactive' });
        }

        req.user = user;
        next();
    } catch (error) {
        logger.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.requireAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};