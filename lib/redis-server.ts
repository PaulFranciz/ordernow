import { createClient } from 'redis';

// This file should only be imported in server components or API routes
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

// Connect to Redis when this module is imported
redisClient.connect().catch(console.error);

export { redisClient }; 