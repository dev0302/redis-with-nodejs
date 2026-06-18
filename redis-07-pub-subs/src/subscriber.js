// connecting redis
import Redis from "ioredis";

const subscriber = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
// REDIS_URL = redis://127.0.0.1:6379

subscriber.on("connect", () => {
    console.log("subscriber Connected");
})

subscriber.on("error", (err) => {
    console.error("subscriber error: ", err);
    
})

subscriber.subscribe("notifications", (err) => {
    if (err) {
        console.error("Error occurred while subscribing: ", err);
    } else {
        console.log("Successfully subscribed to notifications");
    }
});

subscriber.on("message", (channel, message) => {
    console.log("received on ", channel, ": ", JSON.parse(message));
});

// export default subscriber;