import { createClient } from 'redis';

const redisClient = createClient({
  username: 'default',
  password: '2UF2b51I0sWkhbW6oWjc3TDkiBA9ebcI',
  socket: {
    host: 'redis-13665.c300.eu-central-1-1.ec2.redns.redis-cloud.com',
    port: 13665
  }
});

redisClient.on('error', err => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

async function clearCache() {
  try {
    await redisClient.connect();
    await redisClient.del("categories");
    console.log("Successfully cleared categories cache");
  } catch (error) {
    console.error("Error clearing cache:", error);
  } finally {
    await redisClient.disconnect();
    process.exit(0);
  }
}

clearCache(); 