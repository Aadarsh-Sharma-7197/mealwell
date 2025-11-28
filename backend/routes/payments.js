const express = require('express');
const router = express.Router();

// Create Razorpay order
router.post('/create-order', (req, res) => {
  res.json({ message: 'Create payment order - coming soon' });
});

// Verify Razorpay payment
router.post('/verify', (req, res) => {
  res.json({ message: 'Verify payment - coming soon' });
});

// Get payment history
router.get('/history', (req, res) => {
  res.json({ message: 'Get payment history - coming soon' });
});

module.exports = router;
