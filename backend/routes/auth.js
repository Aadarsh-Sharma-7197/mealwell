const express = require('express');
const router = express.Router();

// Placeholder routes - we'll add controllers later
router.post('/register', (req, res) => {
  res.json({ message: 'Register route - coming soon' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Login route - coming soon' });
});

router.get('/me', (req, res) => {
  res.json({ message: 'Get user route - coming soon' });
});

module.exports = router;
