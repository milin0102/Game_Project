const Otp = require("../models/otp");
const moment = require("moment");

//Sending hardcoded otp currently
async function sendOtp(data){
    try {
        if(!data.phoneNo){
            return {
                httpStatusCode:400,
                success:false,
                message:"phone no is required!"
            }
        }
        let otp = 1234;
        let date = moment().format("YYYY-MM-DD HH:mm:ss")
        let res = await Otp.create({PhoneNo : data.phoneNo ,Otp:otp ,CreatedDate :date}).catch((e)=>{
            console.log(e);
            throw e;
        })

        return {
            httpStatusCode:200,
            success:true,
            message: "Otp send successfully"
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

exports.sendOtp = sendOtp