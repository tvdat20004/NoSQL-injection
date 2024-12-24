require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    mongodb_uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/secure_app',
    jwt_secret: process.env.JWT_SECRET || 'my-key_hereeeeee',
    jwt_expiration: '24h',
    bcrypt_rounds: 10,
    upload_path: './uploads',
    allowed_file_types: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    max_file_size: 5 * 1024 * 1024 // 5MB
};