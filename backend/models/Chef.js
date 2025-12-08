const mongoose = require('mongoose');

const chefSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  rating: { 
    type: Number, 
    default: 5.0,
    min: 0,
    max: 5
  },
  reviewsCount: { 
    type: Number, 
    default: 0 
  },
  mealsDelivered: { 
    type: Number, 
    default: 0 
  },
  location: { 
    type: String, 
    required: [true, 'Location is required']
  },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  cuisines: [{
    type: String,
    enum: ['Indian', 'Continental', 'Asian', 'Mediterranean', 'Vegan', 'Keto', 'All']
  }],
  specialties: [{
    type: String,
    enum: ['Diabetic-Friendly', 'Heart-Healthy', 'Weight Loss', 'High Protein', 'Low Sodium', 'Vegan', 'All']
  }],
  experienceYears: {
    type: Number,
    default: 0
  },
  pricePerMeal: {
    type: Number,
    required: [true, 'Price per meal is required'],
    default: 350
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  },
  documents: {
    idProof: String,
    kitchenPhoto: String
  },
  signatureDishes: [String],
  coverImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop'
  },
  availableSlots: {
    breakfast: { type: Boolean, default: true },
    lunch: { type: Boolean, default: true },
    dinner: { type: Boolean, default: true }
  },
  weeklyCapacity: {
    type: Number,
    default: 50  // Max meals per week
  }
}, { 
  timestamps: true 
});

// Index for faster queries
chefSchema.index({ location: 1, isAvailable: 1 });
chefSchema.index({ cuisines: 1 });
chefSchema.index({ rating: -1 });

module.exports = mongoose.model('Chef', chefSchema);
