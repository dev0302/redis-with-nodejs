// npm i bullmq
import dotenv from "dotenv";
import express from "express";
import Redis from "ioredis";

// to test/run it----------

// -> npm run dev
// -> new terminal : node src/subscriber.js
// -> 3-4 more new terminal : node src/subscriber.js
// then go to postman : (already in notion notes how to test it)

// ----------------

dotenv.config();

const app = express();

app.use(express.json());

const publisher = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

publisher.on("connect", () => {
    console.log("publisher Connected");
})

publisher.on("error", (err) => {
    console.error("publisher error: ", err);
    
})

app.post("/notifications", async (req, res) => {

    const payload = {
        title: req.body.title,
        createdAt: new Date().toISOString()
    }
    
    const receivers = await publisher.publish("notifications", JSON.stringify(payload));
    res.json({
        message: `Notification sent to ${receivers} subscribers!`,
        payload,
    });

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

