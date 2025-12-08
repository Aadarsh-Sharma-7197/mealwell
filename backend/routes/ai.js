const express = require("express");
const router = express.Router();
const { generateMealPlan } = require("../controllers/aiController");
const { auth } = require("../middleware/auth");

router.post("/generate-plan", auth, generateMealPlan);

module.exports = router;
