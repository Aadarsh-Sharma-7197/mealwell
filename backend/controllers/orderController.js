const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Chef = require('../models/Chef');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Customer only)
exports.createOrder = async (req, res) => {
  try {
    const { chefId, items, totalAmount, discount, gst, deliveryAddress, deliveryDate, deliverySlot, customerNotes } = req.body;

    // Validation
    if (!items || items.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Order must contain at least one item' 
      });
    }

    // Calculate final amount
    const finalAmount = totalAmount + gst - discount;

    // Create order
    const order = await Order.create({
      customerId: req.user.id,
      chefId,
      items,
      totalAmount,
      discount,
      gst,
      finalAmount,
      deliveryAddress,
      deliveryDate,
      deliverySlot,
      customerNotes,
      status: 'pending',
      paymentStatus: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Get all orders (with filters)
// @route   GET /api/orders
// @access  Private
exports.getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus, limit = 10, page = 1 } = req.query;

    let filter = {};

    // Filter by user role
    if (req.user.userType === 'customer') {
      filter.customerId = req.user.id;
    } else if (req.user.userType === 'chef') {
      filter.chefId = req.user.id;
    }

    // Additional filters
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const orders = await Order.find(filter)
      .populate('customerId', 'name email phone profile')
      .populate('chefId', 'name email phone profile')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name email phone profile')
      .populate('chefId', 'name email phone profile');

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    // Check authorization
    if (
      order.customerId._id.toString() !== req.user.id &&
      order.chefId?._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to view this order' 
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Chef only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, chefNotes } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    // Check if chef owns this order
    if (order.chefId?.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this order' 
      });
    }

    // Update status and timestamp
    order.status = status;
    if (chefNotes) order.chefNotes = chefNotes;

    const now = new Date();
    if (status === 'confirmed') order.deliveryStatus.confirmed = now;
    if (status === 'preparing') order.deliveryStatus.preparing = now;
    if (status === 'ready') order.deliveryStatus.ready = now;
    if (status === 'out_for_delivery') order.deliveryStatus.outForDelivery = now;
    if (status === 'delivered') {
      order.deliveryStatus.delivered = now;
      
      // Update chef stats
      await Chef.findOneAndUpdate(
        { userId: req.user.id },
        { $inc: { mealsDelivered: order.items.length } }
      );
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const { cancelReason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    // Check authorization
    if (order.customerId.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to cancel this order' 
      });
    }

    // Can't cancel if already preparing or delivered
    if (['preparing', 'ready', 'out_for_delivery', 'delivered'].includes(order.status)) {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot cancel order at this stage' 
      });
    }

    order.status = 'cancelled';
    order.cancelReason = cancelReason;
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};
