const express = require("express");
const router = express.Router();
const { generateMealPlan, getMyPlan, savePlan } = require("../controllers/aiController");
const { auth } = require("../middleware/auth");

router.post("/generate-plan", auth, generateMealPlan);
router.get("/my-plan", auth, getMyPlan);
router.post("/save-plan", auth, savePlan);

module.exports = router;
