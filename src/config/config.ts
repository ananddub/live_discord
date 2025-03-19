import dotenv from "dotenv";
dotenv.config();
export const CONFIG = {
    PORT: process.env.PORT || 3000,
    MONGO_URL:
        process.env.MONGO_URL || "mongodb://localhost:27017/live_discord",
    REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
    NATS_URL: process.env.NATS_URL || "nats://localhost:4222",
    NATS_USER: process.env.NATS_USER || "user1",
    NATS_PASSWORD: process.env.NATS_PASSWORD || "password1",
};
