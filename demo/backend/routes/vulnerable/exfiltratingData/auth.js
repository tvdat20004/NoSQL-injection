const jwt = require("jsonwebtoken");
const router = require("express").Router();
const User = require("./User");
// JWT Secret
const JWT_SECRET = "your-secret-key";

// Auto setup initial data
const setupInitialData = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});

    // Create admin user
    await User.create({
      username: "administrator",
      email : "lmao@example.com",
      password: "secretpass",
      role: "admin",
    });

    // Create test user
    await User.create({
      username: "wiener",
      password: "peter",
      email : "wiener@gmail.com",
      role: "user",
    });

    console.log("\nTest data for testcase 3 created successfully");
    console.log("Created users:");
    console.log("- administrator:secretpass (admin)");
    console.log("- wiener:peter (user)");
  } catch (error) {
    console.error("Failed to create test data:", error);
  }
};
setupInitialData();
// Middleware to verify JWT


router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      username: username,
      password: password,
    });

    if (user) {
      const token = jwt.sign({ username: user.username }, JWT_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("token", token, { httpOnly: true });
      res.json({
        success: true,
        user: { username: user.username, email: user.email },
        role: user.role,
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Vulnerable user lookup endpoint
router.get('/lookup', async (req, res) => {
  try {
      const whereClause = `this.username == '${req.query.username}'`;
      console.log("Generated where clause:", whereClause);
      
      const query = {
          $where: whereClause
      };
      
      console.log("Full query:", JSON.stringify(query, null, 2));
      
      const user = await User.findOne(query);
      
      if (user) {
          console.log("Found user:", user.username);
          res.json({
              username: user.username,
              email : user.email,
              role: user.role
          });
      } else {
          console.log("No user found");
          res.status(404).json({ error: 'User not found' });
      }
  } catch (error) {
      console.error('Lookup error details:', error);
      res.status(500).json({ error: 'Server error during lookup', details: error.message });
  }
});

// Logout Route
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});
module.exports = router;
