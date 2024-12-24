const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { authenticate, requireAdmin } = require('../middleware/auth');
const postController = require('../controllers/postController');
const config = require('../config/config');

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.upload_path);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: config.max_file_size
    },
    fileFilter: (req, file, cb) => {
        if (config.allowed_file_types.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});

// Post routes
router.post('/create', 
    authenticate,
    requireAdmin,
    upload.single('file'),
    [
        body('title').trim().notEmpty().isLength({ max: 200 }),
        body('description').trim().notEmpty(),
        validate
    ],
    postController.createPost
);

router.get('/', 
    authenticate,
    postController.getPosts
);

router.post('/:postId/comment',
    authenticate,
    [
        body('text').trim().notEmpty().isLength({ max: 1000 }),
        validate
    ],
    postController.addComment
);

module.exports = router;