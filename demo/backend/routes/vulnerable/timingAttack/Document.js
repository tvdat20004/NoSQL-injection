const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: String,
    content: String,
    accessLevel: Number,
    authorizedUsers: [{
        userId: String,
        accessKey: String,
        permissions: [String],
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user'
        }
    }],
    metadata: {
        tags: [String],
        secretFlags: [String],
        lastAccessed: [Date]
    },
    securityConfig: {
        accessPattern: String,
        verificationTokens: [String]
    }
}, { collection: 'db5' });

module.exports = mongoose.model('db5', documentSchema);