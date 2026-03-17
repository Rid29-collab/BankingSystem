const express = require('express');
const authController = require("../controllers/auth.controller");
const { authMiddleware } = require("../middleware/jwt.middleware");
const router = express.Router();

router.post("/register", authController.userRegister);
router.post("/login", authController.loginUser);

router.get("/profile",authMiddleware,(req,res) => {
    res.json({
        message:"Welcome user",
        user: req.user
    });
})
module.exports = router;