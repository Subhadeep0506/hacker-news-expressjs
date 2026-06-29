import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { config } from '../config.js';
import { rateLimitLog } from './logging.js';


const sendCommand = async (...args: string[]): Promise<any> => {
    const res = await fetch(`${config.UPSTASH_REDIS_REST_URL}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${config.UPSTASH_REDIS_REST_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(args),
    });
    const data = await res.json() as { result?: unknown; error?: string };
    if (data.error) throw new Error(data.error);
    return data.result;
};

export const loginLimiter = rateLimit({
    windowMs: 15 * 60_000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({ sendCommand }),
    handler: (req, res) => {
        rateLimitLog.warn({ ip: req.ip, path: req.path, limiter: 'login' }, 'rate limit exceeded');
        res.status(429).json({ error: 'rate_limited', message: 'Too many login attempts, try again later' });
    },
});

export const writeLimiter = rateLimit({
    windowMs: 60_000,
    max: 30,
    keyGenerator: (req) => {
        const session = (req as any).session;
        if (session?.id) return session.id;
        return req.socket.remoteAddress ?? 'unknown';
    },
    store: new RedisStore({ sendCommand }),
    handler: (req, res) => {
        const session = (req as any).session;
        rateLimitLog.warn({
            user: session?.hnUsername,
            sessionId: session?.id,
            ip: req.ip,
            path: req.path,
            limiter: 'write',
        }, 'rate limit exceeded');
        res.status(429).json({ error: 'rate_limited', message: 'Too many write requests, slow down' });
    },
});
