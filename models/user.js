const mongoose = require("mongoose")

const customerSchema = mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
    PhoneNo:{
        type:String
    },
    Otp:{
        type:Number,
        required:true
    },
    CreatedDate:{
        type:Date,
        required:true
    }
})

const User = mongoose.model('users',customerSchema,);
module.exports = User