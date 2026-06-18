<p align="center">
  <img src="./assets/redis-logo.png" alt="Redis Logo" width="120" />
</p>

# Redis with Node.js

A hands-on Redis learning repository built with Node.js, Express, ioredis, MongoDB, Docker, raw Redis data structures, BullMQ, queues, OTP flows, and Pub/Sub.

This repository is organized as a learning journey. Each folder is a small standalone project that demonstrates one Redis concept clearly before moving to the next one.

## Folder Structure

```text
redis-with-nodejs/
├── assets/
│   └── redis-logo.png                         # Redis logo used in this README
├── redis-01-nodejs/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js                    # MongoDB connection helper
│   │   │   └── redis.js                       # ioredis client setup
│   │   └── index.js                           # Redis + Mongo health-check server
│   ├── aboutthisproject.txt                   # Notes for the first Redis + Node setup
│   ├── docker-compose.yml                     # Local Redis container
│   ├── package.json                           # Express, ioredis, mongoose, dotenv
│   └── package-lock.json
├── redis-02-nodejs/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js                    # MongoDB connection helper
│   │   │   └── redis.js                       # Redis client setup
│   │   └── index.js                           # Basic Redis string CRUD APIs
│   ├── aboutthisproject.txt
│   ├── docker-compose.yml
│   ├── package.json
│   └── package-lock.json
├── redis-03-nodejs-otp/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── redis.js
│   │   └── index.js                           # OTP generation, expiry, verify, TTL
│   ├── aboutthisproject.txt
│   ├── docker-compose.yml
│   ├── package.json
│   └── package-lock.json
├── redis-04-nodejs-otp-hashset-adv/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── redis.js
│   │   └── index.js                           # Advanced OTP using Redis hashes
│   ├── aboutthisproject.txt
│   ├── docker-compose.yml
│   ├── package.json
│   └── package-lock.json
├── redis-05-queue/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── redis.js
│   │   └── index.js                           # Raw Redis list queue using LPUSH/RPOP
│   ├── aboutthisproject.txt
│   ├── docker-compose.yml
│   ├── package.json
│   └── package-lock.json
├── redis-06-bullmq/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js                    # Present for continuity with previous folders
│   │   │   └── redis.js                       # ioredis helper
│   │   ├── api.js                             # Producer route that adds BullMQ jobs
│   │   ├── index.js                           # Express API entrypoint
│   │   ├── queue.js                           # BullMQ queue + Redis connection config
│   │   └── worker.js                          # BullMQ worker that processes jobs
│   ├── aboutthisproject.txt
│   ├── docker-compose.yml
│   ├── package.json
│   └── package-lock.json
└── redis-07-pub-subs/
    ├── src/
    │   ├── index.js                           # Publisher API
    │   └── subscriber.js                      # Redis subscriber process
    ├── aboutthisproject.txt
    ├── docker-compose.yml
    ├── package.json
    └── package-lock.json
```

## Learning Path

| Folder | Topic | Main Redis Concept |
|---|---|---|
| `redis-01-nodejs` | Node.js + Redis starter | Redis connection and `PING` health check |
| `redis-02-nodejs` | Basic Redis operations | `SET`, `GET`, `DEL`, `EXISTS` |
| `redis-03-nodejs-otp` | OTP storage | Expiring keys with `EX` and TTL |
| `redis-04-nodejs-otp-hashset-adv` | Advanced OTP attempts | Redis hashes, counters, blocking, expiry |
| `redis-05-queue` | Raw queue | Redis lists with `LPUSH` and `RPOP` |
| `redis-06-bullmq` | Production-style queue | BullMQ jobs, workers, retries, backoff |
| `redis-07-pub-subs` | Real-time broadcast | Redis Pub/Sub publisher and subscribers |

## Common Prerequisites

- Node.js 18+ recommended
- npm
- Docker Desktop or a local Redis server
- MongoDB connection string for folders that call `dbConnect()`
- Postman, Thunder Client, or curl for API testing

Most folders include the same Redis Docker setup:

```bash
docker compose up -d
```

This starts Redis on:

```text
redis://localhost:6379
```

## Common Environment Variables

Create a `.env` file inside the folder you are running.

For folders `redis-01-nodejs` through `redis-05-queue`:

```env
PORT=3000
DATABASE_URL=mongodb://127.0.0.1:27017/redis-learning
REDIS_URL=redis://localhost:6379
```

For `redis-06-bullmq`:

```env
PORT=3000
```

`redis-06-bullmq/src/queue.js` currently connects BullMQ to Redis at `localhost:6379`.

For `redis-07-pub-subs`:

```env
PORT=3000
REDIS_URL=redis://localhost:6379
```

## How to Run Any Folder

Move into the example folder:

```bash
cd redis-01-nodejs
```

Install dependencies:

```bash
npm install
```

Start Redis:

```bash
docker compose up -d
```

Create the required `.env` file for that folder.

Start the server:

```bash
npm run dev
```

Or run without nodemon:

```bash
npm start
```

## Folder-by-Folder Explanation

## 1. `redis-01-nodejs` - Redis + MongoDB Health Checks

This is the starter project. It sets up an Express server, connects MongoDB through `mongoose`, connects Redis through `ioredis`, and exposes simple routes to confirm both services are alive.

### What it demonstrates

- Loading environment variables with `dotenv`
- Connecting Express to MongoDB
- Creating a reusable Redis client
- Running a Redis `PING`
- Checking MongoDB connection state

### Important files

```text
src/index.js              # Express app and health routes
src/config/redis.js       # ioredis client
src/config/database.js    # Mongoose connection
```

### Routes

| Method | Route | What it does |
|---|---|---|
| `GET` | `/` | Confirms the Express server is running |
| `GET` | `/redis` | Calls `redis.ping()` and returns `PONG` |
| `GET` | `/mongo` | Reads `mongoose.connection.readyState` |

### Example

```bash
curl http://localhost:3000/redis
```

Expected response:

```json
{
  "success": true,
  "redis": "PONG"
}
```

## 2. `redis-02-nodejs` - Basic Redis String Operations

This folder focuses on basic Redis key-value operations through a simple banner API. It stores one banner message in Redis using a fixed key: `app:banner`.

### What it demonstrates

- `redis.set()`
- `redis.get()`
- `redis.del()`
- `redis.exists()`
- Using Redis as fast in-memory application state

### Routes

| Method | Route | Redis command | What it does |
|---|---|---|---|
| `POST` | `/banner` | `SET` | Stores or overwrites the banner message |
| `GET` | `/banner` | `GET` | Reads the banner message |
| `DELETE` | `/banner` | `DEL` | Deletes the banner message |
| `GET` | `/banner/exists` | `EXISTS` | Checks whether the banner key exists |

### Example

```bash
curl -X POST http://localhost:3000/banner \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Welcome to my app!\"}"
```

Redis stores:

```text
app:banner -> Welcome to my app!
```

## 3. `redis-03-nodejs-otp` - OTP with Expiring Keys

This folder uses Redis to store temporary OTP values. Each OTP is stored under a phone-specific key and expires automatically after 30 seconds.

### What it demonstrates

- Generating numeric OTPs
- Storing temporary values with expiry
- Reading an OTP back for verification
- Deleting OTP after successful verification
- Inspecting remaining TTL

### Redis key pattern

```text
otp:<phone>
```

Example:

```text
otp:9876543210 -> 482731
```

### Routes

| Method | Route | What it does |
|---|---|---|
| `POST` | `/otp` | Generates and stores a 6-digit OTP with 30-second expiry |
| `POST` | `/otp/verify` | Verifies OTP and deletes the key on success |
| `GET` | `/otp/:phone/ttl` | Returns remaining TTL for that phone's OTP |

### Example

```bash
curl -X POST http://localhost:3000/otp \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"9876543210\"}"
```

Verify:

```bash
curl -X POST http://localhost:3000/otp/verify \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"9876543210\",\"otp\":\"123456\"}"
```

## 4. `redis-04-nodejs-otp-hashset-adv` - Advanced OTP with Hashes and Attempt Blocking

This is an improved OTP flow. Instead of storing only the OTP string, it stores structured OTP metadata inside a Redis hash.

### What it demonstrates

- Redis hashes with `HSET` and `HGETALL`
- OTP expiry with `EXPIRE`
- Failed attempt tracking with `HINCRBY`
- Temporary blocking after too many failed attempts
- Storing metadata like `createdAt`, `lastAttemptAt`, and `blockedUntil`

### Redis hash structure

```text
otp:<phone>
├── otp
├── attempts
├── maxAttempts
├── createdAt
├── lastAttemptAt
└── blockedUntil
```

### Logic

1. User requests OTP.
2. API checks whether the phone number is currently blocked.
3. API writes OTP metadata to Redis using `HSET`.
4. Redis expires the whole hash after `OTP_EXPIRY`.
5. On wrong OTP, attempts are incremented.
6. After `MAX_ATTEMPTS`, the user is temporarily blocked.
7. On correct OTP, the Redis key is deleted.

### Routes

| Method | Route | What it does |
|---|---|---|
| `POST` | `/otp` | Generates an OTP hash with attempt metadata |
| `POST` | `/otp/verify` | Verifies OTP, increments attempts, or blocks user |
| `GET` | `/otp/:phone/ttl` | Returns remaining Redis TTL |

## 5. `redis-05-queue` - Raw Redis Queue with Lists

This folder demonstrates how queues work internally by using Redis lists directly.

### What it demonstrates

- Producer-consumer queue fundamentals
- Pushing jobs into Redis with `LPUSH`
- Processing jobs with `RPOP`
- Storing JSON payloads as strings
- Why raw queues are useful for learning but limited for production

### Queue key

```text
queue:emails
```

### Flow

```text
Client
  |
  v
POST /emails
  |
  v
LPUSH queue:emails
  |
  v
Redis List
  |
  v
GET /emails/proccess-one
  |
  v
RPOP queue:emails
```

> Note: the route is spelled exactly as implemented: `/emails/proccess-one`.

### Routes

| Method | Route | What it does |
|---|---|---|
| `POST` | `/emails` | Adds an email job to the Redis list |
| `GET` | `/emails/proccess-one` | Pops one job and simulates sending it |

### Example

```bash
curl -X POST http://localhost:3000/emails \
  -H "Content-Type: application/json" \
  -d "{\"to\":\"dev@example.com\",\"subject\":\"Hello\",\"body\":\"Redis queue test\"}"
```

Process one job:

```bash
curl http://localhost:3000/emails/proccess-one
```

### Why this matters

Raw Redis queues help you understand the basics, but you must build retries, failed-job storage, priority, scheduling, and monitoring yourself. That is why the next folder moves to BullMQ.

## 6. `redis-06-bullmq` - BullMQ Queue with Worker and Retries

This folder upgrades the raw queue idea into a more production-ready queue using BullMQ.

### What it demonstrates

- Creating a BullMQ `Queue`
- Adding jobs from an Express API
- Running a separate Worker process
- Processing jobs asynchronously
- Automatic retry attempts
- Exponential backoff
- Queue/worker separation

### Important files

```text
src/index.js      # Express server
src/api.js        # Producer route
src/queue.js      # BullMQ queue and Redis connection config
src/worker.js     # Background worker
```

### Route

| Method | Route | What it does |
|---|---|---|
| `POST` | `/welcome-email` | Adds a `send-welcome-email` job to the BullMQ queue |

### Run it

Terminal 1 - start Redis:

```bash
docker compose up -d
```

Terminal 2 - start API:

```bash
npm run dev
```

Terminal 3 - start worker:

```bash
node src/worker.js
```

### Example

```bash
curl -X POST http://localhost:3000/welcome-email \
  -H "Content-Type: application/json" \
  -d "{\"to\":\"john@example.com\",\"name\":\"John\"}"
```

Expected API response:

```json
{
  "message": "welcome email added to queue",
  "jobId": "1"
}
```

Expected worker logs:

```text
Processing email job... 1 send-welcome-email { to: 'john@example.com', name: 'John' }
Email job completed 1 send-welcome-email { to: 'john@example.com', name: 'John' }
job completed. 1 send-welcome-email { to: 'john@example.com', name: 'John' }
```

### BullMQ job options used

```js
{
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 3000
  }
}
```

## 7. `redis-07-pub-subs` - Redis Publish/Subscribe

This folder demonstrates real-time broadcast messaging with Redis Pub/Sub.

### What it demonstrates

- Publisher/subscriber architecture
- Redis channels
- Broadcasting one message to multiple active subscribers
- Fire-and-forget real-time messaging
- Why Pub/Sub is different from queues

### Important files

```text
src/index.js          # Publisher Express API
src/subscriber.js     # Subscriber process
```

### Channel

```text
notifications
```

### Route

| Method | Route | What it does |
|---|---|---|
| `POST` | `/notifications` | Publishes a notification payload to the `notifications` Redis channel |

### Run it

Terminal 1 - start Redis:

```bash
docker compose up -d
```

Terminal 2 - start API publisher:

```bash
npm run dev
```

Terminal 3 - start subscriber:

```bash
node src/subscriber.js
```

You can open more terminals and run more subscribers:

```bash
node src/subscriber.js
```

### Example

```bash
curl -X POST http://localhost:3000/notifications \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Hello from Redis Pub/Sub\"}"
```

Expected API response:

```json
{
  "message": "Notification sent to 1 subscribers!",
  "payload": {
    "title": "Hello from Redis Pub/Sub",
    "createdAt": "2026-06-18T12:30:00.000Z"
  }
}
```

Expected subscriber output:

```text
received on notifications : {
  title: 'Hello from Redis Pub/Sub',
  createdAt: '2026-06-18T12:30:00.000Z'
}
```

### Pub/Sub limitation

Redis Pub/Sub does not persist messages. If no subscriber is connected when the message is published, the message is lost.

Use Pub/Sub for:

- Live notifications
- Chat broadcasts
- Real-time updates
- WebSocket fan-out

Use BullMQ or Redis Streams for:

- Email queues
- Payment jobs
- Retriable background work
- Persistent processing

## Redis Concepts Covered

| Concept | Folder |
|---|---|
| Redis connection with ioredis | `redis-01-nodejs` |
| Health checks with `PING` | `redis-01-nodejs` |
| String key-value storage | `redis-02-nodejs` |
| Expiring keys | `redis-03-nodejs` |
| TTL inspection | `redis-03-nodejs`, `redis-04-nodejs-otp-hashset-adv` |
| Hashes | `redis-04-nodejs-otp-hashset-adv` |
| Atomic counters | `redis-04-nodejs-otp-hashset-adv` |
| Raw Redis lists as queues | `redis-05-queue` |
| Background jobs | `redis-05-queue`, `redis-06-bullmq` |
| Retries and backoff | `redis-06-bullmq` |
| Publish/Subscribe | `redis-07-pub-subs` |

## Suggested Study Order

1. Start with `redis-01-nodejs` to understand connection setup.
2. Move to `redis-02-nodejs` for basic commands.
3. Use `redis-03-nodejs-otp` to understand expiring keys.
4. Study `redis-04-nodejs-otp-hashset-adv` for richer Redis data modeling.
5. Learn queue fundamentals in `redis-05-queue`.
6. Use `redis-06-bullmq` to see how production queues are usually built.
7. Finish with `redis-07-pub-subs` for real-time broadcasting.

## Notes

- Every folder is intentionally standalone.
- Each example includes its own `package.json` and `docker-compose.yml`.
- Some folder names and route names preserve the original learning-project naming.
- The examples are built for learning, so some responses expose values like OTPs for testing. Do not expose OTPs in production applications.

## License

No license file is currently included. Add a `LICENSE` file before using this repository as a public reusable template.
