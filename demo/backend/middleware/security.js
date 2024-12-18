const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: { success: false, message: 'Too many login attempts, please try again later' }
});

const securityMiddleware = (req, res, next) => {
    helmet()(req, res, () => {
        mongoSanitize()(req, res, () => {
            loginLimiter(req, res, next);
        });
    });
};

module.exports = {
    securityMiddleware,
    loginLimiter
};