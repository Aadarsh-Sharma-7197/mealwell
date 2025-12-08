const User = require("../models/User");
const Chef = require("../models/Chef");

// @desc    Become a Chef
// @route   POST /api/users/become-chef
// @access  Private
exports.becomeChef = async (req, res) => {
  try {
    const { phone, location, experience, specialization, bio } = req.body;

    // req.user is set by auth middleware
    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.userType === "chef") {
      return res
        .status(400)
        .json({ success: false, message: "User is already a chef" });
    }

    // Update User
    user.userType = "chef";
    if (phone) user.phone = phone;
    if (location) user.profile.location = location;
    if (bio) user.profile.bio = bio;
    await user.save();

    // Create Chef Profile
    // Check if chef profile already exists (maybe from previous attempt)
    let chef = await Chef.findOne({ userId: user._id });
    if (!chef) {
      chef = await Chef.create({
        userId: user._id,
        location: location || "Not set",
        experienceYears: experience || 0,
        specialties: specialization ? [specialization] : [],
        // Default values for required fields
        pricePerMeal: 300,
        cuisines: ["Indian"],
      });
    } else {
      chef.location = location || chef.location;
      chef.experienceYears = experience || chef.experienceYears;
      if (specialization) chef.specialties = [specialization];
      await chef.save();
    }

    res.json({
      success: true,
      message: "Congratulations! You are now a chef.",
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Become Chef Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to process request" });
  }
};
