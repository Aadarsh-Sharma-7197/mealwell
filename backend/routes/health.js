const express = require("express");
const router = express.Router();
const { getHealthStats } = require("../controllers/healthController");
const { auth } = require("../middleware/auth");

router.get("/", auth, getHealthStats);

module.exports = router;
