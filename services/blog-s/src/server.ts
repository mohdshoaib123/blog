import express from "express";
import "dotenv/config";
import blogRouter from "./routes/blog.js"
import {createClient} from "redis"
import { startCacheConsumer } from "./utils/consumer.js";
import cors from "cors";

const app=express();
app.use(express.json());
app.use(cors());


const PORT =process.env.PORT || 1000;
startCacheConsumer();







export const redisClient = createClient({
  url: process.env.REDIS_URL as string,
});

// 🔴 Error event listener (VERY IMPORTANT)
redisClient.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

// 🟡 Reconnecting
redisClient.on("reconnecting", () => {
  console.log("🔄 Reconnecting to Redis...");
});

// 🟢 Connected
redisClient.on("connect", () => {
  console.log("🟢 Redis connecting...");
});

redisClient.on("ready", () => {
  console.log("✅ Redis ready to use");
});

// 🔌 Graceful disconnect
redisClient.on("end", () => {
  console.log("🔌 Redis connection closed");
});

// 🚀 Connect function with retry
 const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (err) {
    console.error("❌ Redis connection failed:", err);

    // Retry after 5 sec
    setTimeout(connectRedis, 5000);
  }
};

await connectRedis();
app.use("/api/v1",blogRouter)


app.listen(PORT,()=>{
  console.log(`server is running on port ${PORT}`)
})


