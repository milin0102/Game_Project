const express = require("express");
const router = express.Router()
const otpController = require("../controllers/otpController")

router.post("/sendotp",otpController.sendOtp)

module.exports = router;