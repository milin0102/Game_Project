const joi = require("joi");

const UserSignUpSchema = joi.object({
    name: joi.string().min(1).required(),
    password: joi.string(),
    email: joi.string().email(),
    otp:joi.number(),
    phoneNo:joi.number().required()
})

module.exports = {
    UserSignUpSchema
}