const express = require("express");
const router = express.Router();
const User = require("./users");
const ROUTES = require("./constants");
// Login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Vulnerable to NoSQL injection
    const user = await User.findOne({
      username: username,
      password: password,
    });

    if (user) {
      // Tạo session token
      const sessionToken = Buffer.from(
        JSON.stringify({
          username: user.username,
          role: user.role,
          timestamp: Date.now(),
        })
      ).toString("base64");

      // Set cookie và trả về response phù hợp với role
      res.setHeader("Set-Cookie", `session=${sessionToken}; Path=/;  HttpOnly`);

      if (user.role === "admin") {
        res.json({
          success: true,
          role: "admin",
          message: "Admin login successful",
          redirectUrl: ROUTES.ADMIN,
        });
      } else {
        res.json({
          success: true,
          role: "user",
          message: "User login successful",
          redirectUrl: ROUTES.USER,
        });
      }
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


// Route kiểm tra quyền admin
router.get("/check-admin", (req, res) => {
  try {
    const sessionCookie = req.cookies.session;
    if (!sessionCookie) {
      return res
        .status(401)
        .json({ success: false, message: "No session found" });
    }

    const sessionData = JSON.parse(
      Buffer.from(sessionCookie, "base64").toString()
    );
    if (sessionData.role === "admin") {
      res.json({ success: true, message: "Valid admin session" });
    } else {
      res.status(403).json({ success: false, message: "Not authorized" });
    }
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid session" });
  }
});
router.post("/logout", (req, res) => {
  try {
    res.setHeader("Set-Cookie", "session=; Path=/; HttpOnly; Max-Age=0");
    res.json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
module.exports = router;
