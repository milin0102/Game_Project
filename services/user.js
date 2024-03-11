const express = require("express");
const User = require("../models/user")
const {getBcryptPassword , comparePassword , encryptUserId , decryptUserId} = require("../utils/utils")
const moment = require("moment");
const {UserSignUpSchema }= require("../middlewares/request-validator")
const Otp = require("../models/otp")

//Signup functionality for a user
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
        //Updating otp IsUsed flag to true currently as we have hardcoded our otp to 1234
        await Otp.updateOne({Otp:data.otp , PhoneNo: data.phoneNo , IsUsed:false},{IsUsed:true}).catch((e)=>{
            console.log(e);
            throw e;
        })
        return {
            httpStatusCode:200,
            success:true,
            message:"User created successfully",
            data:{
                UserId: encryptUserId(newUser._id)
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

//login functionality for a user
async function login(data){
    try {
        //phoneno  required
        if(!data.phoneNo){
            return {
                httpStatusCode:422,
                success:false,
                message:"phone number is required"
            }
        }

        //password required
        if(!data.password){
            return {
                httpStatusCode:422,
                success:false,
                message:"password is required"
            }
        }
        let user = await User.find({PhoneNo : data.phoneNo}).catch((e)=>{
            console.log(e);
            throw e;
        })

        if(!user.length){
            return {httpStatusCode:404,
            success:false,
            message:"No user found with this phone number"}
        }else if(!comparePassword(data.password , user[0].Password)){
            //Comparing password it is hashed using bcrypt
                return {httpStatusCode:400,
                    success:false,
                    message:"Password is incorrect"}
        }else {
            return {
                httpStatusCode:200,
                success:true,
                message:"Login successfully",
                data:{
                    UserId : encryptUserId(user[0]._id)
                }
            }
        } 
    } catch (error) {
        console.log(error);
        throw error;
    }
}

exports.signup = signup
exports.login = login