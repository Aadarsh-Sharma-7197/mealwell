const Customer = require('../models/Customer');
const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Get customer profile
// @route   GET /api/customers/profile
// @access  Private (Customer only)
exports.getProfile = async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user.id })
      .populate('userId', 'name email phone profile')
      .populate('favoriteChefs');

    if (!customer) {
      return res.status(404).json({ 
        success: false,
        message: 'Customer profile not found' 
      });
    }

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Get customer profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Update customer profile
// @route   PUT /api/customers/profile
// @access  Private (Customer only)
exports.updateProfile = async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user.id });

    if (!customer) {
      return res.status(404).json({ 
        success: false,
        message: 'Customer profile not found' 
      });
    }

    // Update fields
    const allowedFields = [
      'healthGoals', 'dietaryRestrictions', 'allergies',
      'calorieTarget', 'preferences', 'deliveryAddress'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        customer[field] = req.body[field];
      }
    });

    await customer.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: customer
    });
  } catch (error) {
    console.error('Update customer profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Get customer orders
// @route   GET /api/customers/orders
// @access  Private (Customer only)
exports.getOrders = async (req, res) => {
  try {
    const { status, limit = 10, page = 1 } = req.query;

    let filter = { customerId: req.user.id };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('chefId', 'name profile')
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
    console.error('Get customer orders error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Subscribe to plan
// @route   POST /api/customers/subscribe
// @access  Private (Customer only)
exports.subscribePlan = async (req, res) => {
  try {
    const { planId, planName, totalMeals, durationDays } = req.body;

    const customer = await Customer.findOne({ userId: req.user.id });

    if (!customer) {
      return res.status(404).json({ 
        success: false,
        message: 'Customer profile not found' 
      });
    }

    // Check if already has active plan
    if (customer.activePlan.status === 'active') {
      return res.status(400).json({ 
        success: false,
        message: 'You already have an active plan' 
      });
    }

    // Set active plan
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);

    customer.activePlan = {
      planId,
      planName,
      startDate,
      endDate,
      totalMeals,
      mealsConsumed: 0,
      status: 'active'
    };

    await customer.save();

    res.json({
      success: true,
      message: 'Plan subscribed successfully',
      data: customer.activePlan
    });
  } catch (error) {
    console.error('Subscribe plan error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Add chef to favorites
// @route   POST /api/customers/favorites/:chefId
// @access  Private (Customer only)
exports.addFavoriteChef = async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user.id });

    if (!customer) {
      return res.status(404).json({ 
        success: false,
        message: 'Customer profile not found' 
      });
    }

    const chefId = req.params.chefId;

    if (customer.favoriteChefs.includes(chefId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Chef already in favorites' 
      });
    }

    customer.favoriteChefs.push(chefId);
    await customer.save();

    res.json({
      success: true,
      message: 'Chef added to favorites',
      data: customer.favoriteChefs
    });
  } catch (error) {
    console.error('Add favorite chef error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Remove chef from favorites
// @route   DELETE /api/customers/favorites/:chefId
// @access  Private (Customer only)
exports.removeFavoriteChef = async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user.id });

    if (!customer) {
      return res.status(404).json({ 
        success: false,
        message: 'Customer profile not found' 
      });
    }

    customer.favoriteChefs = customer.favoriteChefs.filter(
      id => id.toString() !== req.params.chefId
    );

    await customer.save();

    res.json({
      success: true,
      message: 'Chef removed from favorites',
      data: customer.favoriteChefs
    });
  } catch (error) {
    console.error('Remove favorite chef error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};
