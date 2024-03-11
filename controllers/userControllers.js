const express =  require("express");
const router = express.Router();
const userService =  require("../services/user");


async function signUp(req,res){
    try {
       await userService.signup(req.body).then((signUpRes)=>{
            console.log("Hello" + signUpRes.success);
            let httpStatusCode = signUpRes.httpStatusCode;
            delete signUpRes.httpStatusCode;
            return res.status(httpStatusCode).json(signUpRes)
       })
    } catch (error) {
        console.log(error);
        throw error;
    }
}

exports.signUp = signUp