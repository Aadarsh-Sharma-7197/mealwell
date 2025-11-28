const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  chefId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  planId: String,
  orderNumber: {
    type: String,
    unique: true
  },
  items: [{
    mealName: {
      type: String,
      required: true
    },
    description: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number,
    price: {
      type: Number,
      required: true
    },
    quantity: { 
      type: Number, 
      default: 1,
      min: 1
    },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack']
    }
  }],
  totalAmount: { 
    type: Number, 
    required: true 
  },
  discount: {
    type: Number,
    default: 0
  },
  gst: {
    type: Number,
    default: 0
  },
  finalAmount: {
    type: Number,
    required: true
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: String,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String
  },
  deliveryDate: Date,
  deliverySlot: String,  // e.g., "08:00 AM - 09:00 AM"
  deliveryStatus: {
    orderPlaced: { type: Date, default: Date.now },
    confirmed: Date,
    preparing: Date,
    ready: Date,
    outForDelivery: Date,
    delivered: Date
  },
  customerNotes: String,
  chefNotes: String,
  cancelReason: String
}, { 
  timestamps: true 
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const dateStr = date.getFullYear().toString() + 
                   (date.getMonth() + 1).toString().padStart(2, '0') + 
                   date.getDate().toString().padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    this.orderNumber = `MW${dateStr}${random}`;
  }
  next();
});

// Index for faster queries
orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ chefId: 1, status: 1 });
orderSchema.index({ orderNumber: 1 });

module.exports = mongoose.model('Order', orderSchema);
