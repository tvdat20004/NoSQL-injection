const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Too many attempts, please try again later'
    },
    keyGenerator: (req) => req.body.userId || req.ip
});

module.exports = { authLimiter };