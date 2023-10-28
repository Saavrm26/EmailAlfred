const Redis = require("ioredis");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const redisConfig = {
  port: process.env.REDIS_PORT,
  host: process.env.WORKER_HOST,
};

const redisConnection = new Redis(redisConfig);

module.exports = redisConnection;
