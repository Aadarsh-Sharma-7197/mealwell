const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getOrders,
  subscribePlan,
  addFavoriteChef,
  removeFavoriteChef
} = require('../controllers/customerController');
const { auth } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Get customer profile
router.get('/profile', getProfile);

// Update customer profile
router.put('/profile', updateProfile);

// Get customer orders
router.get('/orders', getOrders);

// Subscribe to plan
router.post('/subscribe', subscribePlan);

// Add chef to favorites
router.post('/favorites/:chefId', addFavoriteChef);

// Remove chef from favorites
router.delete('/favorites/:chefId', removeFavoriteChef);

module.exports = router;
