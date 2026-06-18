import { Queue } from "bullmq";

export const connection = {
    host: "localhost",
    port: 6379,
};

// for production :
// export const connection = {
//   host: process.env.REDIS_HOST || "localhost",
//   port: Number(process.env.REDIS_PORT) || 6379,
// };

export const emailQueue = new Queue("emails", {connection});

// queue.js is actually the heart of your BullMQ setup. It is the file that creates a connection to Redis and defines the queue that both your API and worker will use.

// queue.js is a shared configuration file that creates and exports a BullMQ queue connected to Redis. It doesn't process jobs itself—it simply provides the queue object that producers (api.js) use to add jobs and workers (worker.js) use to connect to the same Redis-backed queue.


//                 queue.js
//         ┌──────────────────────┐
//         │ connection           │
//         │ host: localhost      │
//         │ port: 6379           │
//         │                      │
//         │ emailQueue           │
//         │ Queue("emails")      │
//         └──────────┬───────────┘
//                    │
//         ┌──────────┴──────────┐
//         │                     │
//         ▼                     ▼
//      api.js               worker.js
//         │                     │
// emailQueue.add()      Worker("emails")
//         │                     │
//         └──────────┬──────────┘
//                    ▼
//               Redis Queue
//              ┌─────────────┐
//              │   emails    │
//              │ Job #1      │
//              │ Job #2      │
//              │ Job #3      │
//              └─────────────┘
//                    │
//                    ▼
//               Worker processes
//               one job at a time