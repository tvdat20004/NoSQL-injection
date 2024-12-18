const bcrypt = require('bcryptjs');
const crypto = require('crypto');

class PasswordUtils {
  // Hash password with salt
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }

  // Compare password
  static async comparePassword(inputPassword, storedPassword) {
    return bcrypt.compare(inputPassword, storedPassword);
  }

  // Generate secure reset token
  static generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Validate password strength
  static validatePasswordStrength(password) {
    // Minimum 8 characters, at least one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  }
}

module.exports = PasswordUtils;