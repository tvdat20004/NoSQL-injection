const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    isHidden: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'user'
    }
});

module.exports = mongoose.model('User', userSchema);