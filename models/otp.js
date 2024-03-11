const mongoose = require("mongoose");

const otpSchema = mongoose.Schema({
    PhoneNo:{
        type:Number,
        required:true
    },
    Otp:{
        type:Number,
        required:true
    },
    CreatedDate:{
        type:Date,
        required:true
    },
    IsUsed:{
        type:Boolean,
        default:false
    }
})

const Otp = mongoose.model('otps',otpSchema)
module.exports = Otp