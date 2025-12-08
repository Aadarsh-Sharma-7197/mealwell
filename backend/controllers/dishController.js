const Dish = require("../models/Dish");
const Chef = require("../models/Chef");
const User = require("../models/User");

// @desc    Add new dish
// @route   POST /api/dishes
// @access  Private (Chef only)
exports.addDish = async (req, res) => {
  try {
    // req.user is attached by auth middleware
    const chef = await Chef.findOne({ userId: req.user._id });
    if (!chef) {
      return res.status(403).json({
        success: false,
        message: "Not authorized. Chef profile not found.",
      });
    }

    const dish = await Dish.create({
      chefId: chef._id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      data: dish,
    });
  } catch (error) {
    console.error("Add dish error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get dishes by chef ID
// @route   GET /api/dishes/chef/:chefId
// @access  Public
exports.getChefDishes = async (req, res) => {
  try {
    const dishes = await Dish.find({
      chefId: req.params.chefId,
      available: true,
    });
    res.json({
      success: true,
      count: dishes.length,
      data: dishes,
    });
  } catch (error) {
    console.error("Get dishes error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get MY dishes (for Chef Dashboard)
// @route   GET /api/dishes
// @access  Private (Chef)
exports.getDishes = async (req, res) => {
  try {
    const chef = await Chef.findOne({ userId: req.user._id });
    if (!chef) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const dishes = await Dish.find({ chefId: chef._id });

    res.json({
      success: true,
      count: dishes.length,
      data: dishes,
    });
  } catch (error) {
    console.error("Get my dishes error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Update dish
// @route   PUT /api/dishes/:id
// @access  Private (Chef only)
exports.updateDish = async (req, res) => {
  try {
    let dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res
        .status(404)
        .json({ success: false, message: "Dish not found" });
    }

    const chef = await Chef.findOne({ userId: req.user._id });

    if (!chef || dish.chefId.toString() !== chef._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this dish",
      });
    }

    dish = await Dish.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: dish,
    });
  } catch (error) {
    console.error("Update dish error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Delete dish
// @route   DELETE /api/dishes/:id
// @access  Private (Chef only)
exports.deleteDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res
        .status(404)
        .json({ success: false, message: "Dish not found" });
    }

    const chef = await Chef.findOne({ userId: req.user._id });

    if (!chef || dish.chefId.toString() !== chef._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this dish",
      });
    }

    await dish.deleteOne();

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error("Delete dish error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
