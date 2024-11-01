const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const loginRoute = require("./login");
const userRoute = require("./users");

const userRoutes = require('./userRoutes');

const vulQueryString = require("./routes/vulnerable/queryStrings");

//case 2
const cookieParser = require('cookie-parser');
const userRouteCase2 = require('./routes/vulnerable/operatorInjection/auth');

dotenv.config();
const app = express();
const PORT = 8800;

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
    origin: 'http://localhost:3000', // URL của frontend
    credentials: true // Cho phép gửi credentials
}));
app.use(express.json());
app.use(cookieParser());

// app.use(cors());
// app.use(express.json()); 
mongoose.connect(process.env.MONGO_URL1, {})
    .then(() => console.log("DB Connection Successful"))
    .catch((err) => console.log(err));

app.use("/", loginRoute);
app.use("/users", userRoute);
app.use("/api", userRoutes);
app.use("/vulnerable/query", vulQueryString);

//case2

app.use('/api/usersCase2/', userRouteCase2);

app.listen(PORT, () => {
    console.log("Backend server is running!");
});