// middleware/auth.js
const User = require('../models/User');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const token = authHeader.replace('Bearer ', '');
        
        // Luôn query database để lấy thông tin user mới nhất
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // QUAN TRỌNG: Luôn dùng isAdmin từ database, không tin tưởng client
        req.user = {
            _id: user._id,
            username: user.username,
            isAdmin: user.isAdmin  // Lấy trực tiếp từ DB
        };

        next();
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};