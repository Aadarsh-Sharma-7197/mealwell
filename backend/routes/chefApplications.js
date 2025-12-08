const express = require('express');
const router = express.Router();
const {
  submitApplication,
  getAllApplications,
  getApplication,
  approveApplication,
  rejectApplication,
  getMyApplication
} = require('../controllers/chefApplicationController');
const { auth } = require('../middleware/auth');
const { protect: adminProtect } = require('../middleware/adminAuth');

// User routes
router.post('/', auth, submitApplication);
router.get('/my-application', auth, getMyApplication);

// Admin routes - specific routes first, then dynamic
router.get('/admin/all', adminProtect, getAllApplications);
router.get('/:id', adminProtect, getApplication);
router.put('/:id/approve', adminProtect, approveApplication);
router.put('/:id/reject', adminProtect, rejectApplication);

module.exports = router;

