const router = require("express").Router();
const User = require("./users"); 

router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(401).json("Wrong password or username!");
    }
    if (user.password !== req.body.password) {
      return res.status(401).json("Wrong password or username!");
    }

    res.status(200).json(user); // Đảm bảo gửi response
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
