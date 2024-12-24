const Post = require('../models/Post');
const ejs = require('ejs');

// Chỉ admin mới có thể tạo bài đăng
exports.createPost = async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
    }

    try {
        const { title, description, fileUrl, fileType } = req.body;
        
        // Vulnerable template rendering
        let renderedDescription;
        try {
            renderedDescription = ejs.render(description, { process: process });
        } catch (error) {
            console.error('Template rendering error:', error);
            renderedDescription = description;
        }
        
        const post = new Post({
            title,
            description: renderedDescription,
            fileUrl,
            fileType,
            author: req.user._id
        });

        await post.save();
        res.json(post);
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Lấy tất cả bài đăng cho mọi user
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username')
            .populate('comments.user', 'username')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Chi tiết một bài đăng
exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)
            .populate('author', 'username')
            .populate('comments.user', 'username');
        
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Thêm comment vào bài đăng - cho phép mọi user đã đăng nhập
exports.addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const comment = {
            text: req.body.text,
            user: req.user._id
        };

        post.comments.push(comment);
        await post.save();

        // Populate user info trong comment mới
        const populatedPost = await Post.findById(post._id)
            .populate('comments.user', 'username');

        res.json(populatedPost.comments[populatedPost.comments.length - 1]);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};