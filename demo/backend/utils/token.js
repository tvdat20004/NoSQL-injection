const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class TokenUtils {
  // Generate JWT token
  static generateToken(user) {
    return jwt.sign(
      { 
        id: user._id, 
        username: user.username 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
  }

  // Verify JWT token
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  // Generate secure reset token
  static generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Validate reset token
  static isResetTokenValid(token) {
    // Basic validation - ensure token exists and is the right length
    return token && token.length === 64;
  }
}

module.exports = TokenUtils;