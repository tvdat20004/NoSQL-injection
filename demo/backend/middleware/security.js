const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

// Rate limiting cho login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 5, // giới hạn 5 request từ mỗi IP
    message: { success: false, message: 'Too many login attempts, please try again later' }
});

// Middleware bảo mật
const securityMiddleware = (req, res, next) => {
    // Sử dụng helmet
    helmet()(req, res, () => {
        // Sử dụng mongoSanitize
        mongoSanitize()(req, res, () => {
            // Sử dụng loginLimiter
            loginLimiter(req, res, next);
        });
    });
};

module.exports = {
    securityMiddleware,
    loginLimiter
};