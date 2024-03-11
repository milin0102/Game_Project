const express = require("express");
const router = express.Router()
const scoreController = require("../controllers/scoreController")

router.post("/savescore",scoreController.saveScore)
router.post("/totalscore",scoreController.totalScore);
router.post("/weeklyscore" , scoreController.weeklyScore)
module.exports = router;