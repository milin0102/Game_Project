const mongoose = require("mongoose")

const scoreSchema = mongoose.Schema({
    Score:{
        type:Number,
        required:true
    },
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    CreatedDate:{
        type:Date,
        required:true
    }
})

const Score = mongoose.model('scores',scoreSchema,);
module.exports = Score