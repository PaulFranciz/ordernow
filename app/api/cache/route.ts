import { NextResponse } from 'next/server';
import { redisClient } from '@/lib/redis-server';
import { CACHE_TTL } from '@/lib/constants';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Cache key is required' }, { status: 400 });
    }

    const cachedData = await redisClient.get(key);
    if (!cachedData) {
      return NextResponse.json({ data: null });
    }

    return NextResponse.json({ data: JSON.parse(cachedData) });
  } catch (error) {
    console.error('Cache GET error:', error);
    return NextResponse.json({ error: 'Failed to get cached data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { key, data } = await request.json();

    if (!key || !data) {
      return NextResponse.json({ error: 'Cache key and data are required' }, { status: 400 });
    }

    await redisClient.setEx(key, CACHE_TTL, JSON.stringify(data));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cache POST error:', error);
    return NextResponse.json({ error: 'Failed to cache data' }, { status: 500 });
  }
} 