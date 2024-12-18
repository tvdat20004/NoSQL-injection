const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    resetToken: String
}, {
    strict: false 
}, { collection: 'db4' });

module.exports = mongoose.model('db4', userSchema);