const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  planId: {
    type: String,
    unique: true,
    required: true,
    enum: ['weekly', 'monthly', 'quarterly']
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  originalPrice: Number,
  discount: {
    type: Number,
    default: 0
  },
  totalMeals: {
    type: Number,
    required: true
  },
  durationDays: {
    type: Number,
    required: true
  },
  features: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Plan', planSchema);
