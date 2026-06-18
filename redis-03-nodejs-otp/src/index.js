import express from "express";
import mongoose from "mongoose";
import redis from "./config/redis.js";
import dbConnect from "./config/database.js";
import dotenv from "dotenv";
dotenv.config();

// npm i mongoose express dotenv redis
// in package.json -> type:"module"

const app = express();
app.use(express.json());

dbConnect();

function otpkey(phone){
    return `otp:${phone}`
};

// redis endpoint :  http://localhost:3000/redis, the callback executes.
app.post("/otp", async (req,res) => {

    try {

        const {phone} = req.body;

        const otp = Math.floor(100000 + Math.random() * 900000);

        const response = await redis.set(otpkey(phone), otp, "EX", 30); //30sec expiry

        // Key              Value      Time To Live
        // ----------------------------------------
        // otp:9876543210   482731     30 seconds
                
        res.json({
            success: true,
            message: "otp sent successfully",
            otp: otp //for now only to see otp for checking working
        });

    } catch (err) {
        console.error("Redis error while sending otp : ", err);
        res.json({
            success: false,
            error: err
        })
        
    }
})



app.post("/otp/verify", async (req,res) => {

    try {

        const {phone, otp} = req.body; 
        const savedOtp = await redis.get(otpkey(phone));

        if (!savedOtp) {
            return res.status(400).json({
                message: "Otp expired or not found"
            });
        }

        if (savedOtp != otp) {
            return res.status(400).json({
                message: "Invalid otp"
            });
        }

        // assuming validation etc to be success
        // now after verification done also delete the corressponding key value pair

        await redis.del(otpkey(phone));
                
        res.json({
            success: true,
            message: "otp verified successfully",
        });

    } catch (err) {
        console.error("Redis error while verifying otp : ", err);
        res.json({
            success: false,
            error: err
        })
        
    }
})



app.get("/otp/:phone/ttl", async (req,res) => {

    try {

        const ttl = await redis.ttl(otpkey(req.params.phone));
                
        res.json({
            ttl: ttl
        });

    } catch (err) {
        console.error("Redis error while getting ttl : ", err);
        res.json({
            success: false,
            error: err
        })
        
    }
})

const PORT = process.env.PORT

// Home route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Server Start
app.listen(PORT, ()=>{
    console.log(`server is started successfully at port ${PORT}` );
})
