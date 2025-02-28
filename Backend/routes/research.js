const express = require("express");
const router = express.Router();
const { submitResearch } = require("../controllers/researchController");

router.post("/submit", submitResearch);

module.exports = router;
