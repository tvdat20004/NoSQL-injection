// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("./users");

// GET all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// New DELETE route to delete a user by ID
router.delete("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

router.get("/users/dashboard", async (req, res) => {
  try {
    const users = await User.find({
      isHidden: false,
    })
      .select("-password -updatedAt -__v")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching non-admin users",
      error: err.message,
    });
  }
});
// Vulnerable search endpoint
router.post("/search", async (req, res) => {
  try {
    const query = req.body.query;
    const users = await User.find(query);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get visible users
router.get("/test/auth-bypass/vulnerable", async (req, res) => {
  try {
    const users = await User.find({ isHidden: false });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
