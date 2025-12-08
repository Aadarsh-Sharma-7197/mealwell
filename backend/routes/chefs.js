const express = require("express");
const router = express.Router();
const {
  getAllChefs,
  getChef,
  updateChef,
} = require("../controllers/chefController");
const { auth } = require("../middleware/auth");

// Get all chefs (Public)
router.get("/", getAllChefs);

// Get single chef (Public)
router.get("/:id", getChef);

// Update chef profile (Private)
router.put("/:id", auth, updateChef);

module.exports = router;
