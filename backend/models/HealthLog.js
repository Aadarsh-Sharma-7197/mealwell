const mongoose = require('mongoose');

const HealthLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  weight: {
    type: Number,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  protein: {
    type: Number,
    required: true
  },
  water: {
    type: Number, // in ml
    default: 0
  },
  sleep: {
    type: Number, // in hours
    default: 0
  },
  heartRate: {
    type: Number, // bpm
    default: 0
  },
  mood: {
    type: String,
    enum: ['Great', 'Good', 'Neutral', 'Bad', 'Terrible'],
    default: 'Good'
  }
}, {
  timestamps: true
});

// Compound index to ensure one log per user per day
HealthLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HealthLog', HealthLogSchema);
