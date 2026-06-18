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

const BANNER_KEY = "app:banner";

// redis endpoint :  http://localhost:3000/redis, the callback executes.
app.post("/banner", async (req,res) => {
    try {
        const message = await redis.set(BANNER_KEY, req.body.message);
        // everytime it called, value will be overwritten
        
        res.json({
            success: true,
            message_sent: message
        });

    } catch (err) {
        console.error("Redis error : ", err);
        res.json({
            success: false,
            error: err
        })
        
    }
})


// Suppose you send:

// {
//   "message": "Welcome to my app!"
// }

// Redis executes:

// SET app:banner "Welcome to my app!"

// Now Redis memory contains:

// Key           Value
// -------------------------------
// app:banner -> Welcome to my app!


app.get("/banner", async(req,res) => {
    try {
        const message = await redis.get(BANNER_KEY);
        res.json({
            success: true,
            message: message
        });
        
    } catch (err) {
        console.error("Redis error : ", err);
        res.json({
            success: false,
            error: err
        })
        
    }
})


app.delete("/banner", async(req,res) => {
    try {
        await redis.del(BANNER_KEY);
        res.json({
            success: true,
            message: "deleted successfully"
        });
        
    } catch (err) {
        console.error("Redis error : ", err);
        res.json({
            success: false,
            error: err
        })
        
    }
})


app.get("/banner/exists", async(req,res) => {
    try {
        const exists = await redis.exists(BANNER_KEY);
        res.json({
            success: true,
            exists: Boolean(exists)
        });
        
    } catch (err) {
        console.error("Redis error : ", err);
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
