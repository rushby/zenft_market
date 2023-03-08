import Redis from "ioredis";

// Create a Redis client instance
const redisClient = new Redis({
    host: "127.0.0.1",
    port: 6379,
});

// Test the Redis connection
redisClient.ping()
    .then((result: string) => {
        console.log("Redis connection successful:", result);
    })
    .catch((err: Error) => {
        console.log("Redis connection failed:", err);
    });

export default redisClient;
