const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

exports.connectdb = async()=>{
    try{
        const connection = await mongoose.connect(process.env.MONGO_URL);
        console.log("Database connected successfully");
    }
    catch(error){
        console.log("Error occured while connecting to db" , error);
    }
}