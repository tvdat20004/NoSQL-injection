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
}, { collection: 'db1' });

module.exports = mongoose.model('db1', userSchema);