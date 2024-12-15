const router = require("express").Router();
const User = require("../../vulnerable/exfiltratingData/User");

router.get('/lookup', async (req, res) => {
    const user = req.query.username;
  
    try {
      const query = { username: user };
      console.log(query);
      const userFound = await User.findOne(query);
      if (userFound) {
        res.json({
          username: userFound.username,
          email: userFound.email
        });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
// Logout Route
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});
module.exports = router;
