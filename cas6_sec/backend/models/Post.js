const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    fileUrl: {
        type: String,
        trim: true
    },
    fileType: {
        type: String,
        enum: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [{
        text: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);