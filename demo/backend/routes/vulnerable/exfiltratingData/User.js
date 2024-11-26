const mongoose = require("mongoose");
require("dotenv").config();
// Create a separate connection for test case 3
console.log("LOCAL_DB:", process.env.LOCAL_DB);

const localConnection = mongoose.createConnection(process.env.LOCAL_DB);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { collection: "users" }
);

// Use the local connection for this model
module.exports = localConnection.model("User", userSchema);
