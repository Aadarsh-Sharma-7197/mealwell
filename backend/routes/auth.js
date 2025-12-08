const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Register user
router.post('/register', register);

// Login user
router.post('/login', login);

// Get current user
router.get('/me', auth, getMe);

// Update user profile
router.put('/profile', auth, updateProfile);

module.exports = router;
