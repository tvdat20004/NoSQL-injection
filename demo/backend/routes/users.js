const router = require("express").Router();
const User = require("../users");

router.get("/users/non-admin", async (req, res) => {
    try {
        const users = await User.find({ 
            isAdmin: false 
        }).select('-password -updatedAt -__v')
          .sort({ createdAt: -1 });
        
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ 
            message: "Error fetching non-admin users", 
            error: err.message 
        });
    }
});

module.exports = router;