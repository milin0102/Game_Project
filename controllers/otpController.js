const otp = require("../services/otp");


async function sendOtp(req,res){
try {
    let otpResp = await otp.sendOtp(req.body).catch((e)=>{
        console.log(e);
        throw e;
    })
    if(otpResp){
        let httpStatusCode = otpResp.httpStatusCode;
        delete otpResp.httpStatusCode;
        res.status(httpStatusCode).json(otpResp)
    }else{
        res.status(500).json({
            success:false,
            message:"Something went wrong!!"
        })
    }
} catch (error) {
    console.log(error);
    throw error;
}
}

exports.sendOtp = sendOtp;