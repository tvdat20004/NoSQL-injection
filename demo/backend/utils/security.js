// backend/utils/security.utils.js
const crypto = require('crypto');

const compareSecurely = (input, stored) => {
    if (!input || !stored || input.length !== stored.length) {
        return false;
    }
    
    try {
        return crypto.timingSafeEqual(
            Buffer.from(input),
            Buffer.from(stored)
        );
    } catch {
        return false;
    }
};

const generateSecureToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

module.exports = {
    compareSecurely,
    generateSecureToken
};