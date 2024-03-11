const score = require("../services/score");


async function saveScore(req,res){
try {
    let otpResp = await score.saveScore(req.body).catch((e)=>{
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

async function totalScore(req,res){
    try {
        let totalScoreResp = await score.totalScore(req.body).catch((e)=>{
            console.log(e);
            throw e;
        })
        let httpStatusCode = totalScoreResp.httpStatusCode
        delete totalScoreResp.httpStatusCode
        return res.status(httpStatusCode).json(totalScoreResp)
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function weeklyScore(req,res){
    try {
        let weekResp = await score.weeklyScore(req.body).catch((e)=>{
            console.log(e);
            throw e;
        })
        let httpStatusCode = weekResp.httpStatusCode;
        delete weekResp.httpStatusCode
        return res.status(httpStatusCode).json(weekResp)
    } catch (error) {
        console.log(error);
        throw error;
    }
}

exports.saveScore = saveScore;
exports.totalScore = totalScore
exports.weeklyScore = weeklyScore