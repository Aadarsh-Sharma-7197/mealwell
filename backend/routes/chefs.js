const express = require('express');
const router = express.Router();

// Get all chefs
router.get('/', (req, res) => {
  res.json({ message: 'Get all chefs - coming soon' });
});

// Get single chef
router.get('/:id', (req, res) => {
  res.json({ message: 'Get single chef - coming soon' });
});

// Create chef profile
router.post('/', (req, res) => {
  res.json({ message: 'Create chef - coming soon' });
});

// Update chef profile
router.put('/:id', (req, res) => {
  res.json({ message: 'Update chef - coming soon' });
});

module.exports = router;
