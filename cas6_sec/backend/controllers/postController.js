const Post = require('../models/Post');
const sanitizeHtml = require('sanitize-html');
const config = require('../config/config');
const logger = require('../utils/logger');
const path = require('path');
const fs = require('fs').promises;



exports.createPost = async (req, res) => {
    try {
        const { title, description } = req.body;
        let fileUrl = null;
        let fileType = null;

        if (req.file) {
            // Kiểm tra loại tệp tin có hợp lệ không
            if (!config.allowed_file_types.includes(req.file.mimetype)) {
                await fs.unlink(req.file.path);
                return res.status(400).json({ error: 'Invalid file type' });
            }

            fileUrl = `/uploads/${req.file.filename}`;
            fileType = req.file.mimetype;
        }

        const post = new Post({
            title: title.trim(),
            description: sanitizeHtml(description),
            fileUrl,
            fileType,
            author: req.user._id
        });

        await post.save();
        
        await post.populate('author', 'username');
        res.json(post);
    } catch (error) {
        logger.error('Create post error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


exports.getPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);
        const skip = (page - 1) * limit;

        const posts = await Post.find()
            .populate('author', 'username')
            .populate('comments.user', 'username')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Post.countDocuments();

        res.json({
            posts,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        logger.error('Get posts error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.postId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const sanitizedText = sanitizeHtml(text, {
            allowedTags: ['b', 'i', 'em', 'strong'],
            allowedAttributes: {}
        });

        post.comments.push({
            text: sanitizedText,
            user: req.user._id
        });

        await post.save();
        await post.populate('comments.user', 'username');

        res.json(post.comments[post.comments.length - 1]);
    } catch (error) {
        logger.error('Add comment error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};