const express = require('express');
const router = express.Router();
const { login, getProfile } = require('../controllers/adminController');
const { protect } = require('../middleware/adminAuth');

router.post('/login', login);
router.get('/profile', protect, getProfile);

module.exports = router;

