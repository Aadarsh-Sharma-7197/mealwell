const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
} = require("../controllers/authController");
const { auth } = require("../middleware/auth");
const upload = require("../middleware/uploadMiddleware");

// Register user
router.post("/register", register);

// Login user
router.post("/login", login);

// Get current user
router.get("/me", auth, getMe);

// Update user profile
router.put("/profile", auth, upload.single("avatar"), updateProfile);

// Update password
router.put("/updatepassword", auth, updatePassword);



module.exports = router;
