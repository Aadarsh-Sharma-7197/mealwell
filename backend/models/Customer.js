const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  healthGoals: [{
    type: String,
    enum: ['Weight Loss', 'Muscle Gain', 'Heart Health', 'Diabetes Management', 'General Wellness', 'Energy Boost']
  }],
  dietaryRestrictions: [{
    type: String,
    enum: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Halal', 'Jain', 'None']
  }],
  allergies: [String],
  calorieTarget: {
    type: Number,
    default: 2000
  },
  activePlan: {
    planId: {
      type: String,
      enum: ['weekly', 'monthly', 'quarterly', null],
      default: null
    },
    planName: String,
    startDate: Date,
    endDate: Date,
    totalMeals: Number,
    mealsConsumed: { type: Number, default: 0 },
    status: { 
      type: String, 
      enum: ['active', 'paused', 'cancelled', 'expired'],
      default: null
    }
  },
  preferences: {
    spiceLevel: {
      type: String,
      enum: ['mild', 'medium', 'spicy'],
      default: 'medium'
    },
    mealTimes: {
      breakfast: String,  // e.g., "08:00 AM"
      lunch: String,
      dinner: String
    }
  },
  currentStreak: { 
    type: Number, 
    default: 0 
  },
  totalCaloriesConsumed: {
    type: Number,
    default: 0
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String
  },
  favoriteChefs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chef'
  }]
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Customer', customerSchema);
