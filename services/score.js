const Score = require("../models/score")
const moment = require("moment")
const {ObjectId} = require("mongodb")

async function saveScore(data){
try {
    let userId = new mongodb.ObjectId(data.userId)
    let scoreResp = await Score.find({UserId: userId, CreatedDate :{
        $gte : moment().format("DD-MM-YYYY") , $lt: (moment().add(1,'days')).format("DD-MM-YYYY")
    }})
    console.log(scoreResp);
    if(scoreResp.length>=3){
        return {
            httpStatusCode:300,
            success:false,
            message:"You can't submit score more than thrice a day"
        }
    }
    if(data.score<50 || data.score>500){
        return {
            httpStatusCode:300,
            success:false,
            message:"Score should be within range from 50 to 500"
        }
    }

    let scoreReqObj = {
        UserId : data.userId,
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

async function totalScore(data){
    try {
        if(!data.userId){
            return {
                httpStatusCode:422,
                success:false,
                message:"userId is requiredS"
            }
        }
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
            if(String(data.userId) == String(e._id)){
                rank = count;
                return e;
            }
        })
        console.log(userScoreAndRank);
        return {
            httpStatusCode:200,
            success:true,
            message:"Final Score and Rank",
            data:{
                TotalScore : userScoreAndRank[0].totalScore,
                Rank : rank
            }
        } 
    } catch (error) {
        console.log(error);
        throw error;
    }
}

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
        const currentWeek = getWeekNumber(moment());
        const scoresByWeek = [];

        for (let week = 1; week <= currentWeek; week++) {
            const weekDates = getWeekDates(week, moment().year());
            const startOfWeek = moment(weekDates.startDate.startOf('day')).add(1,'day').toDate()
            const endOfWeek =  weekDates.endDate.endOf('day').toDate()
            
            
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
            if(String(data.userId) == String(e._id)){
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
         console.log(scoresByWeek)
        return {httpStatusCode : 200,
            success:true , 
            data:scoresByWeek
        }
    } catch (error) {
        console.error(error);
    }
}
exports.saveScore = saveScore
exports.totalScore = totalScore
exports.weeklyScore = weeklyScore