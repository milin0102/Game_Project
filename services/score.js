const Score = require("../models/score")
const moment = require("moment")
const mongodb = require("mongodb")
const {decryptUserId} = require("../utils/utils")

//Save score functionality 
async function saveScore(data){
try {
    //decrypting encrypted user id
    let decUserId = decryptUserId(data.userId)


    //change userId from string to ObjectId
    let userId = new mongodb.ObjectId(decUserId.toString())

    //Checking how many times user attempted to add score
    let scoreResp = await Score.find({UserId: userId, CreatedDate :{
        $gte : moment().format("YYYY-MM-DD") , $lt: (moment().add(1,'days')).format("YYY-MM-DD")
    }})
    console.log(scoreResp);
    if(scoreResp.length>=3){
        return {
            httpStatusCode:300,
            success:false,
            message:"You can't submit score more than thrice a day"
        }
    }

    //checking range of score 
    if(data.score<50 || data.score>500){
        return {
            httpStatusCode:300,
            success:false,
            message:"Score should be within range from 50 to 500"
        }
    }

    //add score to db
    let scoreReqObj = {
        UserId : userId,
        Score : data.score,
        CreatedDate: moment().format("YYYY-MM-DD")
    }
    let newScore = await Score.create(scoreReqObj).catch((e)=>{
        console.log(e);
        throw e;
    })

    if(newScore){
        return {
            httpStatusCode:200,
            success:true,
            message:"Score submitted successfully"
        }
    }else{
        return {
            httpStatusCode:200,
            success:true,
            message:"Score not submitted"
        }
    }


} catch (error) {
    console.log(error);
    throw error;
}
}

//total score of a user after signup
async function totalScore(data){
    try {
        if(!data.userId){
            return {
                httpStatusCode:422,
                success:false,
                message:"userId is required"
            }
        }
        //decrypting user id
        let decUserId = decryptUserId(data.userId)

        //group scores based on userIds and sorting them on the basis of total score of each user
        let groupByScores = await Score.aggregate([{
            $group : {
                _id:"$UserId",
                totalScore : {$sum : "$Score"}
            }
        },{
            $sort : {totalScore : -1}
        }]).catch((e)=>{
            console.log(e);
            throw e;
        })
        //console.log(groupByScores);
        let count = 0;
        let rank = 0;
        let userScoreAndRank = groupByScores.filter((e)=>{
            count++;
            console.log(e)
            if(String(decUserId) == String(e._id)){
                rank = count;
                return e;
            }
        })
        return {
            httpStatusCode:200,
            success:true,
            message:"Final Score and Rank",
            data:{
                totalScore : userScoreAndRank[0].totalScore,
                rank : rank
            }
        } 
    } catch (error) {
        console.log(error);
        throw error;
    }
}

//Here we are getting the week number on the basis of today's date 
//It helps us to see how many weeks passed from 1st March
//Taking friday as firstDay
function getWeekNumber(date) {
    const startOfMarch = moment(date).startOf('year').month(2).date(1); // 1st March
    const firstFriday = startOfMarch.day(5) <= 1 ? startOfMarch.day(12) : startOfMarch.day(5);
    return Math.ceil((date - firstFriday) / 604800000) + 1;
}

// Function to get the start and end dates of a week based on the week number, where the week always starts from Friday and ends on Thursday
function getWeekDates(weekNumber, year) {
    const startOfYear = moment().year(year).startOf('year');
    const firstFriday = startOfYear.month(2).date(1).day(5);
    const startDate = moment(firstFriday).add((weekNumber - 1) * 7, 'days');
    const endDate = moment(startDate).add(6, 'days').day(4);
    return { startDate, endDate };
}

// Function to retrieve scores for a user based on weeks starting from Friday, 1st March until the current date
async function weeklyScore(data) {
    try {
        if(!data.userId){
            return {
                httpStatusCode:422,
                success:false,
                message:"UserId is required"
            }
        }
        
        //decrypting user id
        let decUserId = decryptUserId(data.userId)

        const currentWeek = getWeekNumber(moment());
        const scoresByWeek = [];

        for (let week = 1; week <= currentWeek; week++) {
            const weekDates = getWeekDates(week, moment().year());
            const startOfWeek = moment(weekDates.startDate.startOf('day')).add(1,'day').toDate()
            const endOfWeek =  weekDates.endDate.endOf('day').toDate()
            
            
            //grouping score on the basis of start and end date
            const groupByScores = await Score.aggregate([
                {$match : {
                CreatedDate: {$gte: new Date(startOfWeek), $lte: new Date(endOfWeek)},
            }},
            {
                $group :{
                    _id: '$UserId',
                    totalScore : {$sum : '$Score'}
                }
            },{
                $sort : {totalScore:-1}
            }
        ]);

        let index=0;
        let userScoreAndRank = groupByScores.filter((e)=>{
            index++;
            e["rank"] = index;
            if(String(decUserId) == String(e._id)){
                return e;
            }
        })
            if(userScoreAndRank.length){
                scoresByWeek.push({
                    weekNumber: week,
                    rank:userScoreAndRank[0].rank,
                    totalScore: userScoreAndRank[0].totalScore
                });
            }
            
        }
        return {httpStatusCode : 200,
            success:true , 
            data:scoresByWeek
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}
exports.saveScore = saveScore
exports.totalScore = totalScore
exports.weeklyScore = weeklyScore