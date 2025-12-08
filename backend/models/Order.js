const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chefId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chef",
      required: false,
    },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
        type: { type: String, enum: ["plan", "dish"], default: "dish" }, // 'plan' or 'dish'
        nutritionalInfo: {
          calories: Number,
          protein: Number,
          carbs: Number,
          fats: Number,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentId: {
      type: String,
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      phone: String,
    },
    estimatedDeliveryTime: {
      type: Date,
    },
    notes: {
      type: String,
    },
    deliveryStatus: {
      confirmed: Date,
      preparing: Date,
      ready: Date,
      out_for_delivery: Date,
      delivered: Date,
    },
    orderNumber: {
      type: String,
      unique: true,
    },
    finalAmount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
