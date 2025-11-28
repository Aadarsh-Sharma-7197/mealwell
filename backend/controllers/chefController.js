const Chef = require('../models/Chef');
const User = require('../models/User');

// @desc    Get all chefs
// @route   GET /api/chefs
// @access  Public
exports.getAllChefs = async (req, res) => {
  try {
    const { cuisine, specialty, location, minRating, available } = req.query;

    // Build filter
    let filter = {};
    
    if (cuisine) filter.cuisines = cuisine;
    if (specialty) filter.specialties = specialty;
    if (location) filter.location = new RegExp(location, 'i');
    if (minRating) filter.rating = { $gte: parseFloat(minRating) };
    if (available === 'true') filter.isAvailable = true;

    const chefs = await Chef.find(filter)
      .populate('userId', 'name email profile')
      .sort({ rating: -1, mealsDelivered: -1 });

    res.json({
      success: true,
      count: chefs.length,
      data: chefs
    });
  } catch (error) {
    console.error('Get chefs error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Get single chef
// @route   GET /api/chefs/:id
// @access  Public
exports.getChef = async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.id)
      .populate('userId', 'name email phone profile');

    if (!chef) {
      return res.status(404).json({ 
        success: false,
        message: 'Chef not found' 
      });
    }

    res.json({
      success: true,
      data: chef
    });
  } catch (error) {
    console.error('Get chef error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Update chef profile
// @route   PUT /api/chefs/:id
// @access  Private (Chef only)
exports.updateChef = async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.id);

    if (!chef) {
      return res.status(404).json({ 
        success: false,
        message: 'Chef not found' 
      });
    }

    // Check ownership
    if (chef.userId.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this profile' 
      });
    }

    // Update fields
    const allowedFields = [
      'location', 'cuisines', 'specialties', 'experienceYears',
      'pricePerMeal', 'isAvailable', 'signatureDishes', 'coverImage',
      'availableSlots', 'weeklyCapacity'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        chef[field] = req.body[field];
      }
    });

    await chef.save();

    res.json({
      success: true,
      message: 'Chef profile updated successfully',
      data: chef
    });
  } catch (error) {
    console.error('Update chef error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};
