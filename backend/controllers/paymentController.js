const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    // Validation
    if (!amount || !orderId) {
      return res.status(400).json({ 
        success: false,
        message: 'Amount and orderId are required' 
      });
    }

    // Verify order exists and belongs to user
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    if (order.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized' 
      });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency: 'INR',
      receipt: `order_${orderId}`,
      notes: {
        orderId: orderId,
        customerId: req.user._id.toString()
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Update order with Razorpay order ID
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    console.error('Create Razorpay order error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating payment order' 
    });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderId 
    } = req.body;

    // Validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing payment verification data' 
      });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid payment signature' 
      });
    }

    // Update order payment status
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.finalAmount = order.totalAmount;
    
    // Initialize deliveryStatus if not exists
    if (!order.deliveryStatus) {
      order.deliveryStatus = {};
    }
    order.deliveryStatus.confirmed = new Date();
    
    // Generate order number if not exists
    if (!order.orderNumber) {
      order.orderNumber = `ORD${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    }

    await order.save();

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: order
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error verifying payment' 
    });
  }
};

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
exports.getPaymentHistory = async (req, res) => {
  try {
    const orders = await Order.find({
      customerId: req.user._id.toString(),
      paymentStatus: 'paid'
    })
      .populate('chefId')
      .populate({
        path: 'chefId',
        populate: { path: 'userId', select: 'name profile' }
      })
      .select('orderNumber finalAmount totalAmount paymentStatus razorpayPaymentId razorpayOrderId items status deliveryAddress createdAt deliveryStatus')
      .sort({ createdAt: -1 })
      .limit(50);

    // Format the response with detailed information
    const formattedPayments = orders.map(order => {
      // Safely extract chef name
      let chefName = 'N/A';
      if (order.chefId) {
        if (typeof order.chefId === 'object' && order.chefId.userId) {
          chefName = order.chefId.userId.name || 'N/A';
        } else if (typeof order.chefId === 'string') {
          chefName = 'Chef';
        }
      }
      
      return {
        _id: order._id,
        orderNumber: order.orderNumber || order._id.toString().slice(-8).toUpperCase(),
        amount: order.finalAmount || order.totalAmount,
        paymentId: order.razorpayPaymentId,
        razorpayOrderId: order.razorpayOrderId,
        status: order.status,
        paymentStatus: order.paymentStatus,
        items: order.items,
        chefName: chefName,
        deliveryAddress: order.deliveryAddress,
        createdAt: order.createdAt,
        deliveryStatus: order.deliveryStatus,
      };
    });

    res.json({
      success: true,
      count: formattedPayments.length,
      data: formattedPayments
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};
