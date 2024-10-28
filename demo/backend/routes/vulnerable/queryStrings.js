// routes/vulnerable/queryString.js
const router = require("express").Router();
const User = require("../../users");

router.get("/find", async (req, res) => {
    try {
        const query = { username: req.query.username };
        const user = await User.find(query);
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;    