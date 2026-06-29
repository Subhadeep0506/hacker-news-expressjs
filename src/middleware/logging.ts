import pino from 'pino';
import { randomUUID } from 'node:crypto';
import { config } from '../config.js';

const isDev = config.NODE_ENV === 'development';

export const logger = pino({
    level: config.LOG_LEVEL,
    redact: [
        'req.headers.authorization',
        'req.body.password',
        'req.body.pw',
        'res.headers["set-cookie"]',
    ],
    formatters: {
        level(label) {
            return { level: label };
        },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    ...(isDev && {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                ignore: 'pid,hostname',
                messageFormat: '{if component}[{component}] {end}{if method}{method} {end}{if res.statusCode}{res.statusCode} {end}{if url}url: {url} {end}{msg}',
                translateTime: 'HH:MM:ss',
                levelFirst: true,
                colorizeObjects: true,
            },
        },
    }),
});

export const authLog = logger.child({ component: 'auth' });
export const cacheLog = logger.child({ component: 'cache' });
export const sessionLog = logger.child({ component: 'session' });
export const hnLog = logger.child({ component: 'hn' });
export const writeLog = logger.child({ component: 'write' });
export const rateLimitLog = logger.child({ component: 'ratelimit' });

export function genReqId() {
    return randomUUID();
}
