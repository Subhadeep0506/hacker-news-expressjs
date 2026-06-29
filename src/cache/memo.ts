import { redis } from './redis.js';
import { cacheLog } from '../middleware/logging.js';

export async function cached<T>(key: string, ttlSec: number, fn: () => Promise<T>): Promise<T> {
    const hit = await redis.get<T>(key);
    if (hit) {
        cacheLog.debug({ key }, 'cache hit');
        return hit;
    }
    cacheLog.debug({ key, ttlSec }, 'cache miss — fetching');
    const val = await fn();
    await redis.set(key, val, { ex: ttlSec });
    cacheLog.debug({ key, ttlSec }, 'cache populated');
    return val;
}

export async function cachedSingleFlight<T>(
    key: string,
    ttlSec: number,
    fn: () => Promise<T>,
): Promise<T> {
    const hit = await redis.get<T>(key);
    if (hit) {
        cacheLog.debug({ key }, 'cache hit');
        return hit;
    }

    const lock = await redis.set(`lock:${key}`, '1', { px: 5000, nx: true });
    if (!lock) {
        cacheLog.debug({ key }, 'cache miss — waiting on lock');
        await new Promise((r) => setTimeout(r, 50));
        return cachedSingleFlight(key, ttlSec, fn);
    }
    cacheLog.debug({ key }, 'cache miss — acquired lock, fetching');
    try {
        const val = await fn();
        const jittered = Math.floor(ttlSec * (0.9 + Math.random() * 0.2));
        await redis.set(key, val, { ex: jittered });
        cacheLog.debug({ key, ttl: jittered }, 'cache populated');
        return val;
    } finally {
        await redis.del(`lock:${key}`);
    }
}
