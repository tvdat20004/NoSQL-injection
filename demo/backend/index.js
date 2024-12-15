const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

// import route for case 1
const vulnUserRoutesCase1 = require("./routes/vulnerable/authBypass/userRoutes");
const secureUserRoutesCase1 = require("./routes/secure/authBypass/userRoutes");

// import route for case 2
const vulnUserRouteCase2 = require("./routes/vulnerable/operatorInjection/auth");
const secureUserRouteCase2 = require("./routes/secure/operatorInjection/auth");

// import route for case 3
const vulnUserRouteCase3 = require("./routes/vulnerable/exfiltratingData/auth");
const secureUserRouteCase3 = require("./routes/secure/exfiltratingData/auth");


const bodyParser = require("body-parser");

dotenv.config();
const app = express();
const PORT = 8800;

app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: "http://localhost:3000", // URL của frontend
    credentials: true, // Cho phép gửi credentials
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => console.log("DB Connection Successful"))
  .catch((err) => console.log(err));
//case 1 
app.use("/api/vulnerable/case1/", vulnUserRoutesCase1);
app.use("/api/secure/case1/", secureUserRoutesCase1);
//case2
app.use("/api/vulnerable/case2/", vulnUserRouteCase2);
app.use("/api/secure/case2/", secureUserRouteCase2);
// case3 
app.use("/api/vulnerable/case3/", vulnUserRouteCase3);
app.use("/api/secure/case3/", secureUserRouteCase3);
app.listen(PORT, () => {
  console.log("Backend server is running!");
});

