import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    PORT: z.string().default('8080'),
    WORKERS: z.string().default('0'),
    JWT_SECRET: z.string().min(32),
    SESSION_KEY: z.string().length(64),
    UPSTASH_REDIS_REST_URL: z.url(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    LOG_LEVEL: z.string().default('info'),
});

export const config = envSchema.parse(process.env);
