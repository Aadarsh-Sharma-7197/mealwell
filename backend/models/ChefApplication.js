const mongoose = require('mongoose');

const chefApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Personal Information
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  
  // Professional Information
  experienceYears: {
    type: Number,
    required: [true, 'Experience is required'],
    min: 0
  },
  cuisines: [{
    type: String,
    enum: ['Indian', 'Continental', 'Asian', 'Mediterranean', 'Vegan', 'Keto', 'All']
  }],
  specialties: [{
    type: String,
    enum: ['Diabetic-Friendly', 'Heart-Healthy', 'Weight Loss', 'High Protein', 'Low Sodium', 'Vegan', 'All']
  }],
  pricePerMeal: {
    type: Number,
    required: [true, 'Price per meal is required'],
    min: 0
  },
  bio: {
    type: String,
    maxlength: 500
  },
  signatureDishes: [String],
  
  // Documents
  documents: {
    idProof: String, // URL or base64
    kitchenPhoto: String, // URL or base64
    certificate: String // Optional: cooking certificate
  },
  
  // Application Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    default: ''
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date
}, {
  timestamps: true
});

// Index for faster queries
chefApplicationSchema.index({ status: 1, createdAt: -1 });
chefApplicationSchema.index({ userId: 1 });

module.exports = mongoose.model('ChefApplication', chefApplicationSchema);

