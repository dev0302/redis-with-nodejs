// implementing raw queues
import express, { json } from "express";
import redis from "./config/redis.js";
import dbConnect from "./config/database.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

dbConnect();

const QUEUE_KEY = "queue:emails"

// setup job
app.post("/emails", async (req, res) => {

  try {

    const job = {
      to: req.body.to,
      subject: req.body.subject,
      body: req.body.body,
      createdAt: new Date().toISOString(),
    };

    // push into the queue
    await redis.lpush(QUEUE_KEY, JSON.stringify(job)); //only strings accepted as value in redis
    res.json({queued: true, job});

  } catch (err) {

    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });

  }

});


app.get("/emails/proccess-one", async (req, res) => {

  try {

    const rawJob = await redis.rpop(QUEUE_KEY);
    if(!rawJob) {
      return res.json({message: "no jobs found"})
    }

    const job = JSON.parse(rawJob);

    // Simulate sending email
    console.log("Sending email:", job);
    
    res.json({
      success: true,
      message: "email sent",
      job: job
    })

  } catch (err) {

    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
})



 
// Home 

app.get("/", (req, res) => {
  res.send("Server is running!");
});

 
// Start Server

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// -----------------------------------

// Case 1: No Redis
// User
//  │
//  ▼
// POST /signup
//  │
//  ▼
// Express
//  │
//  ├── Save user (50 ms)
//  ├── Send email (2 sec)
//  └── Return response

// User waits ~2 seconds


// Case 2: With Redis

// User
//  │
//  ▼
// POST /signup
//  │
//  ▼
// Express
//  │
//  ├── Save user (50 ms)
//  ├── Push to Redis (2 ms)
//  └── Return response

// User waits ~52 ms
// The worker sends the email later.


// With a queue:

// 100,000 Requests
//         │
//         ▼
//     API Server
//         │
//         ├── Push Job
//         ├── Push Job
//         ├── Push Job
//         └── ...
//               │
//               ▼
//          Redis Queue
//               │
//      ┌────────┼────────┐
//      ▼        ▼        ▼
//  Worker1  Worker2  Worker3

// The API stays responsive while workers drain the queue in the background.