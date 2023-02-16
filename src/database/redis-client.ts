import { createClient } from "redis";
import Container from "typedi";

const redis = createClient({
    url: process.env.REDIS_URL
});

redis.once("ready", () => {
    console.log("Redis has been initialized.");
});

redis.on("error", (err) => {
    console.error(err);
});

Container.set("redis-client", redis);

export default redis;
