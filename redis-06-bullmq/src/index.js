// npm i bullmq
import dotenv from "dotenv";
import express from "express";
import apiRouter from "./api.js";


// how to run it?
// Option 1: Run separately (most common)
// # Terminal 1
// npm run dev

// # Terminal 2
// node src/worker.js

dotenv.config();

const app = express();

app.use(express.json());
app.use(apiRouter);

 
// Home 
app.get("/", (req, res) => {
  res.send("Server is running!");
});

 
// Start Server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


        //          index.js
        //              │
        //   Starts Express Server
        //              │
        //              ▼
        //        Client Request
        //              │
        //              ▼
        //          api.js Route
        //              │
        //  emailQueue.add(...)
        //              │
        //              ▼
        //        Redis Queue ("emails")
        //              │
        //              ▼
        //          worker.js
        //              │
        //   Processes the background job
        //              │
        //              ▼
        //      Sends the welcome email