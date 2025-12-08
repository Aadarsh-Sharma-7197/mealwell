const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema(
  {
    chefId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chef",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Beverage"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    nutritionalInfo: {
      calories: { type: Number, required: true },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fats: { type: Number, default: 0 },
    },
    tags: [
      {
        type: String,
      },
    ],
    image: {
      type: String,
      default: "https://via.placeholder.com/300",
    },
    available: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Dish", dishSchema);
