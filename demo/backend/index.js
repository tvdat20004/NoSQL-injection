const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const loginRoute = require("./login");
const userRoute = require("./users");

const userRoutes = require('./userRoutes');

const vulQueryString = require("./routes/vulnerable/queryStrings");

dotenv.config();
const app = express();
const PORT = 8800;

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json()); 
mongoose.connect(process.env.MONGO_URL, {})
    .then(() => console.log("DB Connection Successful"))
    .catch((err) => console.log(err));

app.use("/", loginRoute);
app.use("/users", userRoute);
app.use("/api", userRoutes);
app.use("/vulnerable/query", vulQueryString);

app.listen(PORT, () => {
    console.log("Backend server is running!");
});