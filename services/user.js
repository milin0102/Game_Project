const express = require("express");
const User = require("../models/user")
const {getBcryptPassword , comparePassword} = require("../utils/utils")
const moment = require("moment");
const {UserSignUpSchema }= require("../middlewares/request-validator")
const Otp = require("../models/otp")

async function signup(data){
    try{
    //payload validation
    const validation = UserSignUpSchema.validate(data)
    if (validation.error) {
        return {
            httpStatusCode:422,
            success:false,
            message:validation.error
        }
    }
    const otp = await Otp.findOne({Otp:data.otp , PhoneNo: data.phoneNo , IsUsed:false}).catch((e)=>{
        console.log(e);
        throw e;
    })
    //Otp expiration check
    if(!otp){
        return {
            httpStatusCode:400,
            success:false,
            message:"Invalid Otp"
        }
    }else if(moment().diff(otp.CreatedDate , 'minutes')>=1){
        await Otp.updateOne({Otp:data.otp , PhoneNo: data.phoneNo , IsUsed:false},{IsUsed:true}).catch((e)=>{
            console.log(e);
            throw e;
        })
        return {
            httpStatusCode:400,
            success:false,
            message:"Otp Expired"
        }
    }
    
    //user already exist , with phoneno as primary key
    let user = await User.findOne({PhoneNo:data.phoneNo}).catch((e)=>{
        console.log(e);
        throw e;
    })
    if(user){
        return {
            httpStatusCode:500,
            success:false,
            message:"User already exist with this phone no."
        }
    }

    let signUpObj = {
        Name:data.name,
        Email:data.email,
        PhoneNo:data.phoneNo,
        Password: getBcryptPassword(data.password),
        Otp:data.otp,
        CreatedDate: moment().format("DD-MM-YYYY")
    }
    let newUser = await User.create(signUpObj).catch((e)=>{
        console.log(e);
        throw e;
    });
    if(newUser){
        await Otp.updateOne({Otp:data.otp , PhoneNo: data.phoneNo , IsUsed:false},{IsUsed:true}).catch((e)=>{
            console.log(e);
            throw e;
        })
        return {
            httpStatusCode:200,
            success:true,
            message:"User created successfully",
            data:{
                UserId:newUser._id
            }
        }
    }
    return {
        httpStatusCode:500,
        success:false,
        message:"User not created !!",
        data:[]
     } 

} catch (error) {

        console.log(error);
        return {
            httpStatusCode:500,
            success:false,
            message:error
        }
    }
}

exports.signup = signup