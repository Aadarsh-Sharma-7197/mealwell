const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  addDish,
  getDishes,
  updateDish,
  deleteDish,
  getChefDishes,
} = require("../controllers/dishController");

// Public routes
router.get("/chef/:chefId", getChefDishes);

// Protected routes
router.use(auth);

router.post("/", addDish);
router.get("/", getDishes);
router.patch("/:id", updateDish);
router.delete("/:id", deleteDish);

module.exports = router;
