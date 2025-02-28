import Redis from 'ioredis';

const redis = new Redis(process.env.UPSTASH_REDIS_REST_URL!);

export async function rateLimit(identifier: string) {
  const now = Date.now();
  const key = `rate-limit:${identifier}`;

  try {
    // Create a pipeline for atomic operations
    const pipeline = redis.pipeline();
    
    // Add the current timestamp and clean up old requests
    pipeline.zadd(key, now, now.toString());
    pipeline.zremrangebyscore(key, 0, now - 60000); // Remove requests older than 1 minute
    
    // Count requests in the last minute
    pipeline.zcard(key);
    
    // Set expiry on the key (cleanup)
    pipeline.expire(key, 60);

    const results = await pipeline.exec();
    
    // Get the request count from the pipeline results
    const requestCount = results![2][1] as number;

    // Return whether the request should be limited
    const success = requestCount <= 20; // Allow 20 requests per minute
    return {
      success,
      limit: 20,
      remaining: Math.max(0, 20 - requestCount),
      reset: now + 60000, // 1 minute from now
    };
  } catch (error) {
    console.error('Rate limiting error:', error);
    // If Redis fails, default to allowing the request
    return {
      success: true,
      limit: 20,
      remaining: 1,
      reset: now + 60000,
    };
  }
} 