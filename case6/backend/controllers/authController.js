const User = require('../models/User');
const crypto = require('crypto');

exports.login = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Vulnerable NoSQL Injection
        const user = await User.findOne({
            username: username,
            password: password
        });

        if (user) {
            const token = crypto.randomBytes(32).toString('hex');
            user.token = token;
            await user.save();
            
            res.json({ token, isAdmin: user.isAdmin });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};