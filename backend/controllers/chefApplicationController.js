const ChefApplication = require('../models/ChefApplication');
const User = require('../models/User');
const Chef = require('../models/Chef');

// @desc    Submit chef application
// @route   POST /api/chef-applications
// @access  Private
exports.submitApplication = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      location,
      coordinates,
      experienceYears,
      cuisines,
      specialties,
      pricePerMeal,
      bio,
      signatureDishes,
      documents
    } = req.body;

    // Validation
    if (!name || !email || !phone || !location || experienceYears === undefined || !pricePerMeal) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user already has a pending application
    const existingApplication = await ChefApplication.findOne({
      userId: req.user._id,
      status: 'pending'
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending application'
      });
    }

    // Check if user is already a chef
    const user = await User.findById(req.user._id);
    if (user.userType === 'chef') {
      return res.status(400).json({
        success: false,
        message: 'You are already a chef'
      });
    }

    // Create application
    const application = await ChefApplication.create({
      userId: req.user._id,
      name,
      email,
      phone,
      location,
      coordinates: coordinates || null,
      experienceYears,
      cuisines: cuisines || [],
      specialties: specialties || [],
      pricePerMeal,
      bio,
      signatureDishes: signatureDishes || [],
      documents: documents || {}
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all applications (Admin only)
// @route   GET /api/chef-applications
// @access  Private (Admin)
exports.getAllApplications = async (req, res) => {
  try {
    const { status } = req.query;
    
    let filter = {};
    if (status) {
      filter.status = status;
    }

    const applications = await ChefApplication.find(filter)
      .populate('userId', 'name email phone profile')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single application
// @route   GET /api/chef-applications/:id
// @access  Private (Admin)
exports.getApplication = async (req, res) => {
  try {
    const application = await ChefApplication.findById(req.params.id)
      .populate('userId', 'name email phone profile')
      .populate('reviewedBy', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Approve application
// @route   PUT /api/chef-applications/:id/approve
// @access  Private (Admin)
exports.approveApplication = async (req, res) => {
  try {
    const { adminNotes } = req.body;

    const application = await ChefApplication.findById(req.params.id)
      .populate('userId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Application is already ${application.status}`
      });
    }

    // Update application status
    application.status = 'approved';
    application.adminNotes = adminNotes || '';
    application.reviewedBy = req.admin._id;
    application.reviewedAt = new Date();
    await application.save();

    // Update user to chef
    const user = application.userId;
    user.userType = 'chef';
    await user.save();

    // Create chef profile
    let chef = await Chef.findOne({ userId: user._id });
    if (!chef) {
      chef = await Chef.create({
        userId: user._id,
        location: application.location,
        coordinates: application.coordinates || null,
        experienceYears: application.experienceYears,
        cuisines: application.cuisines.length > 0 ? application.cuisines : ['Indian'],
        specialties: application.specialties.length > 0 ? application.specialties : [],
        pricePerMeal: application.pricePerMeal,
        signatureDishes: application.signatureDishes,
        documents: application.documents,
        coverImage: application.documents?.kitchenPhoto || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop'
      });
    } else {
      // Update existing chef profile
      chef.location = application.location;
      chef.coordinates = application.coordinates || chef.coordinates;
      chef.experienceYears = application.experienceYears;
      chef.cuisines = application.cuisines.length > 0 ? application.cuisines : chef.cuisines;
      chef.specialties = application.specialties.length > 0 ? application.specialties : chef.specialties;
      chef.pricePerMeal = application.pricePerMeal;
      chef.signatureDishes = application.signatureDishes;
      chef.documents = application.documents;
      await chef.save();
    }

    // Update user profile
    if (application.bio) {
      user.profile.bio = application.bio;
      await user.save();
    }

    res.json({
      success: true,
      message: 'Application approved and chef profile created',
      data: application
    });
  } catch (error) {
    console.error('Approve application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Reject application
// @route   PUT /api/chef-applications/:id/reject
// @access  Private (Admin)
exports.rejectApplication = async (req, res) => {
  try {
    const { adminNotes } = req.body;

    if (!adminNotes) {
      return res.status(400).json({
        success: false,
        message: 'Please provide rejection reason'
      });
    }

    const application = await ChefApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Application is already ${application.status}`
      });
    }

    application.status = 'rejected';
    application.adminNotes = adminNotes;
    application.reviewedBy = req.admin._id;
    application.reviewedAt = new Date();
    await application.save();

    res.json({
      success: true,
      message: 'Application rejected',
      data: application
    });
  } catch (error) {
    console.error('Reject application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's application status
// @route   GET /api/chef-applications/my-application
// @access  Private
exports.getMyApplication = async (req, res) => {
  try {
    const application = await ChefApplication.findOne({ userId: req.user._id })
      .sort({ createdAt: -1 });

    if (!application) {
      return res.json({
        success: true,
        data: null,
        message: 'No application found'
      });
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Get my application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

