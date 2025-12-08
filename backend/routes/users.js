const express = require("express");
const router = express.Router();
const { becomeChef } = require("../controllers/userController");
const { auth } = require("../middleware/auth");

// Become a chef
router.post("/become-chef", auth, becomeChef);

module.exports = router;
