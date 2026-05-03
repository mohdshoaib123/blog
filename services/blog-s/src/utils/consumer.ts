import amqp from "amqplib";
import { redisClient } from "../server.js";
import { sql } from "./db.js";

// let connection: amqp.Connection | null 
// let channel: amqp.Channel | null 

const queueName = "cache_invalidation";

interface CacheInvalidationMessage {
  action: string;
  keys: string[];
}

export const startCacheConsumer = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: process.env.RABBITMQ_HOST,
      port: 5672,
      username: process.env.RABBITMQ_USER,
      password: process.env.RABBITMQ_PASSWORD,
    });

    console.log("✅ RabbitMQ connected");

    connection.on("error", (err) => {
      console.error("❌ Connection error:", err.message);
    });

    connection.on("close", () => {
      console.error("🔌 Connection closed, retrying...");
      retryConnection();
    });

   const channel = await connection.createChannel();

    channel.on("error", (err) => {
      console.error("❌ Channel error:", err.message);
    });

    channel.on("close", () => {
      console.error("⚠️ Channel closed");
    });

    await channel.assertQueue(queueName, { durable: true });
    console.log("✔ cache consumer started");

    channel.consume(queueName, async (msg) => {
      if (!msg) return;

      try {
        const content = JSON.parse(
          msg.content.toString()
        ) as CacheInvalidationMessage;

        console.log("📩 Message received:", content);

        if (content.action === "invalidate_cache") {
          for (const pattern of content.keys) {
            const keys = await redisClient.keys(pattern);

            if (keys.length > 0) {
              await redisClient.del(keys);

              console.log(
                `🧹 Invalidated ${keys.length} keys for pattern: ${pattern}`
              );

              // rebuild cache
              const cacheKey = `blogs::`;
              const blogs =
                await sql`SELECT * FROM blogs ORDER BY created_at DESC`;

              await redisClient.set(cacheKey, JSON.stringify(blogs), {
                EX: 3600,
              });

              console.log(`🔄 Cache rebuilt: ${cacheKey}`);
            }
          }
        }

        channel!.ack(msg);
      } catch (error) {
        console.error("❌ Processing error:", error);
        channel!.nack(msg, false, true);
      }
    });
  } catch (err) {
    console.error("❌ Initial connection failed:", err);
    retryConnection();
  }
};

// 🔁 Retry logic
const retryConnection = () => {
  setTimeout(() => {
    console.log("🔄 Reconnecting to RabbitMQ...");
    startCacheConsumer();
  }, 5000);
};