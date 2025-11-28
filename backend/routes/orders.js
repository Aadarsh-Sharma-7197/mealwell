const express = require('express');
const router = express.Router();

// Get all orders
router.get('/', (req, res) => {
  res.json({ message: 'Get all orders - coming soon' });
});

// Create new order
router.post('/', (req, res) => {
  res.json({ message: 'Create order - coming soon' });
});

// Get single order
router.get('/:id', (req, res) => {
  res.json({ message: 'Get single order - coming soon' });
});

// Update order status
router.put('/:id', (req, res) => {
  res.json({ message: 'Update order - coming soon' });
});

module.exports = router;
