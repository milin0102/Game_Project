const express = require("express")
const router = express.Router()

const userRoutes = require("../routes/user")
const optRoutes = require("../routes/otp")
const scoreRoutes = require("../routes/score")

//routes for different functionalities
router.use("/v1/user",userRoutes)
router.use("/v1/otp",optRoutes)
router.use("/v1/score",scoreRoutes)

module.exports = router;