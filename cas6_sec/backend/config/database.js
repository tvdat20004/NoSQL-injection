const mongoose = require('mongoose');
const config = require('./config');
const logger = require('../utils/logger');

mongoose.connect(config.mongodb_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', (err) => {
    logger.error('MongoDB connection error:', err);
});

db.once('open', () => {
    logger.info('Connected to MongoDB');
});

module.exports = db;