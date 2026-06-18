import express from "express";
import mongoose from "mongoose";
import redis from "./config/redis.js";
import dbConnect from "./config/database.js";
import dotenv from "dotenv";
dotenv.config();

// npm i mongoose express dotenv redis
// in package.json -> type:"module"

const app = express();
dbConnect();

// redis endpoint
// When someone visits: http://localhost:3000/redis, the callback executes.
app.get("/redis", async(req, res) => {
    try {
        const reply = await redis.ping();
        // PING is a Redis command that checks whether the Redis server is alive.
        // Redis replies: PONG
        res.json({ 
            success: true,
            redis: reply
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
})

app.get("/mongo", async(req, res) => {
    try {
        const state = mongoose.connection.readyState;
        res.json({
            success: true,
            connected: state === 1,
            state,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
        });
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


// Program starts
//         │
//         ▼
// Import modules
//         │
//         ▼
// dotenv.config()
// (load .env into process.env)
//         │
//         ▼
// Create Express app
//         │
//         ▼
// dbConnect()
// (connect to MongoDB)
//         │
//         ▼
// Import Redis client
// (Redis connects automatically)
//         │
//         ▼
// Register routes
// (/, /redis, /mongo)
//         │
//         ▼
// app.listen(PORT)
//         │
//         ▼
// Server waits for incoming requests