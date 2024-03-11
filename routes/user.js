const express = require("express");
const router = express.Router()
const userController = require("../controllers/userControllers")
// const checkRoles = require("../middlewares/rolesAuth");
// const jwtAuth = require("../middlewares/jwtauth");



router.post("/signup",userController.signUp)
router.post("/login",userController.login)

module.exports = router