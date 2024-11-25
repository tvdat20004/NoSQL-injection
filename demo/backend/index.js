const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const cookieParser = require('cookie-parser');

// Import routes
const loginRoute = require("./login");
const userRoute = require("./users");

//case 1
const userRoutesSecure = require('./routes/security/authBypass/userRoutes');
const userRoutesVulnerable = require('./routes/vulnerable/authBypass/userRoutes');

//case 2
const userRouteCase2Vul = require('./routes/vulnerable/operatorInjection/auth');
const userRouteCase2Sec = require('./routes/security/operatorInjection/auth');

// Load env variables
dotenv.config();

// Initialize express
const app = express();
const PORT = 8800;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());


// Database connection
mongoose.connect(process.env.MONGO_URL, {})
    .then(() => console.log("DB Connection Successful"))
    .catch((err) => console.log(err));

// Routes
app.use("/", loginRoute);
app.use("/users", userRoute);

//case 1
app.use("/api/security/authBypass", userRoutesSecure);
app.use("/api/vulnerable/authBypass", userRoutesVulnerable);

//case 2
app.use('/api/vulnerable/usersCase2/', userRouteCase2Vul);
app.use('/api/security/usersCase2/', userRouteCase2Sec);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log("Backend server is running!");
});