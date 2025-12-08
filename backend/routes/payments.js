const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getPaymentHistory,
} = require("../controllers/paymentController");
const { auth } = require("../middleware/auth");

// Create Razorpay order
router.post("/create-order", auth, createOrder);

// Verify Razorpay payment
router.post("/verify", auth, verifyPayment);

// Get payment history
router.get("/history", auth, getPaymentHistory);

module.exports = router;
