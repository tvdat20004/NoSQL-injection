const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');
const multer = require('multer');
const User = require('../models/User'); // Thêm model User

// Middleware kiểm tra admin từ database
async function checkAdmin(req, res, next) {
    try {
        // Verify lại user từ database
        const user = await User.findById(req.user._id);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}

// Cấu hình multer cho upload file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
    },
    fileFilter: (req, file, cb) => {
        // Kiểm tra file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            cb(null, false);
            return cb(new Error('Only images allowed!'));
        }
        cb(null, true);
    }
});

// Routes cho admin - sử dụng middleware mới
router.post('/create', auth, checkAdmin, upload.single('file'), postController.createPost);

// Routes cho mọi user đã đăng nhập
router.get('/', auth, postController.getPosts);
router.get('/:postId', auth, postController.getPost);
router.post('/:postId/comment', auth, postController.addComment);

module.exports = router;