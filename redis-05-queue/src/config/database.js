import mongoose from "mongoose";

// npm i dotenv
import dotenv from "dotenv"
dotenv.config();
// function that establish connection between application and databse
const dbConnect = ()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=> console.log("DB connection successfull."))
    .catch((error)=>{
        console.log("Issue in DB connection");
        console.error(error.message);
        process.exit(1);
        
    });
}

export default dbConnect;