const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const config = require('./config/config');
require('./config/database');
const logger = require('./utils/logger');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 100 // giới hạn mỗi IP tới 100 requests trong 15 phút
});

// Apply rate limiter to all routes
app.use(limiter);

// Logging
app.use(morgan('combined', { stream: logger.stream }));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));

// Error handling
app.use((err, req, res, next) => {
    logger.error(err.stack);
    
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ 
            error: 'File upload error',
            message: err.message 
        });
    }
    
    res.status(500).json({ 
        error: 'Server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});