// server.js
const express = require('express');
const cors = require('cors');
const app = express();
require('./config/database');

// Thêm middleware CORS trước các routes
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}));

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});