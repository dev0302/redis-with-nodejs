import express from "express";
import redis from "./config/redis.js";
import dbConnect from "./config/database.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

dbConnect();

const OTP_EXPIRY = 60; // 60 seconds
const MAX_ATTEMPTS = 5; // 5 attempts
const BLOCK_TIME = 1 * 60 * 1000; // 1 minute

function otpKey(phone) {
  return `otp:${phone}`;
}

 
// Generate OTP
 

app.post("/otp", async (req, res) => {
  try {
    const { phone } = req.body;

    const key = otpKey(phone);

    // Check if user is currently blocked
    const existing = await redis.hgetall(key);

    if (
      existing.blockedUntil &&
      Number(existing.blockedUntil) > Date.now()
    ) {
      return res.status(429).json({
        success: false,
        message: "Too many failed attempts. Try again later.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await redis.hset(key, {
      otp,
      attempts: 0,
      maxAttempts: MAX_ATTEMPTS,
      createdAt: Date.now(),
      lastAttemptAt: "",
      blockedUntil: "",
    });

    // OTP expires after 30 seconds
    await redis.expire(key, OTP_EXPIRY);

    res.json({
      success: true,
      message: "OTP sent successfully",
      otp, // Remove this in production
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

 
// Verify OTP
 

app.post("/otp/verify", async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const key = otpKey(phone);

    const data = await redis.hgetall(key);

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found",
      });
    }

    // User blocked?
    if (
      data.blockedUntil &&
      Number(data.blockedUntil) > Date.now()
    ) {
      return res.status(429).json({
        success: false,
        message: "Too many failed attempts. Try again later.",
      });
    }

    // Correct OTP
    if (data.otp === otp) {
      await redis.del(key);

      return res.json({
        success: true,
        message: "OTP verified successfully",
      });
    }

    console.log(data.otp);
    console.log(otp);
    
    

    // Wrong OTP
    const attempts = await redis.hincrby(key, "attempts", 1);

    await redis.hset(key, {
      lastAttemptAt: Date.now(),
    });

    if (attempts >= MAX_ATTEMPTS) {
      await redis.hset(key, {
        blockedUntil: Date.now() + BLOCK_TIME,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
      attemptsLeft: Math.max(0, MAX_ATTEMPTS - attempts),
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

 
// Get Remaining TTL
 

app.get("/otp/:phone/ttl", async (req, res) => {
  try {
    const ttl = await redis.ttl(otpKey(req.params.phone));

    res.json({
      ttl,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

 
// Home
 

app.get("/", (req, res) => {
  res.send("Server is running!");
});

 
// Start Server
 

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});