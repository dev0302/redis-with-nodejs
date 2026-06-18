// worker.js is the consumer in BullMQ.

// If queue.js is the place where jobs are stored, then worker.js is the employee that keeps checking the queue and does the actual work.

import { Worker } from "bullmq";
import { connection } from "./queue.js";

async function sendWelcomeEmail(job) {

    console.log("Processing email job...", job.id, job.name, job.data);
    
    await new Promise( (resolve) => setTimeout(resolve, 1500) );

    console.log("Email job completed", job.id, job.name, job.data);

    // In a real app you might replace it with:
    // await transporter.sendMail(...);
  
}

// const worker = new Worker(...)
// This starts a background process.
// It immediately begins listening to Redis for new jobs.
// It doesn't wait for you to call any function manually.
const worker = new Worker(

    // 1. name of the queue, must match
    "emails",

    // 2. buissness logic inside a async function, Whenever a job arrives, BullMQ automatically calls this function.
    sendWelcomeEmail,

    // 3. pass connection
    { connection }

);

worker.on("ready", () => {
  console.log("✅ Worker connected to Redis and ready to process jobs.");
});

// 4. add event listeners
worker.on("completed", (job) => {
    console.log("job completed.", job.id, job.name, job.data);
})

worker.on("failed", (job, err) => {
    console.log("job failed.", job.id, job.name, job.data, err);
})






// User
//   │
//   ▼
// POST /welcome-email
//   │
//   ▼
// api.js
//   │
//   │  emailQueue.add(job)
//   ▼
// ┌──────────────────────────┐
// │ Redis Queue ("emails")   │
// │                          │
// │ Job #1                   │
// │ Job #2                   │
// │ Job #3                   │
// └─────────────┬────────────┘
//               │
//               │ Worker is always watching
//               ▼
// worker.js
//   │
//   ├─ Read job.data
//   ├─ Send email / process task
//   ├─ Success → completed event
//   └─ Error → failed event (and retry if configured)