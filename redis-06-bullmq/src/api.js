
import { Router } from "express";
import { emailQueue } from "./queue.js";

const router = Router();


// syntax
// emailQueue.add(
//   name,      // String identifying the type of job
//   data,      // Object containing the job payload
//   options    // Optional configuration
// );

// api logic //add to the queue
router.post("/welcome-email", async(req, res) => {

    // add returns a promise -> so await 
    const job = await emailQueue.add(

        "send-welcome-email",

        {
            to: req.body.to,
            name: req.body.name
        },

        // syntax of options ;
        // {
        //     attempts: 3,                 // Retry up to 3 times
        //     delay: 5000,                 // Wait 5 seconds before processing
        //     removeOnComplete: true,      // Delete successful jobs
        //     removeOnFail: true,          // Delete failed jobs
        //     priority: 1,                 // Higher priority jobs run first
        //     backoff: {
        //         type: "exponential",
        //         delay: 3000,
        //     },
        // }

        {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 3000
            }

            // Is the failed job removed?
            // By default: No
            // BullMQ keeps failed jobs in Redis so you can inspect them later.

            // If you want failed jobs to be removed automatically
            // {
            //     attempts: 3,
            //     removeOnFail: true,
            //     removeOnComplete: true,
            // }

            // For production, many teams use something like:

            // {
            // attempts: 3,
            // removeOnComplete: 1000, // keep last 1000 completed jobs
            // removeOnFail: 500,      // keep last 500 failed jobs
            // }
            
        }

    );

    res.json({ message: "welcome email added to queue", jobId: job.id });

} )

export default router;