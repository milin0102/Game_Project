const express = require("express");
const cors = require("cors")
const figlet = require("figlet")
const app = express()
const db = require("./db")
const routes = require("../routes")
const mongoose = require("mongoose")
const path = require("path")

const init = async ()=>{

//express.json for body-parser
app.use(express.json());

//enabling cors for all origins
app.use(cors())

//api and routes
app.use("/api",routes)

require('dotenv').config()

//database connection
db.connectToDb(process.env.MONGO_USERNAME , process.env.MONGO_PASSWORD).then(function(){
    start();
})


}


//after all connections established function for starting server
const start = ()=>{
    //Port to connect to app
const port = process.env.PORT || 3000
app.listen(port , (err)=>{
    if (err) console.log(err);
    console.log("Server listening on PORT: " + port);
})

//project name
figlet.text("Nodejs Assignment",function (err, data) {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(data);
  })

}   

exports.init = init;
exports.start = start;
