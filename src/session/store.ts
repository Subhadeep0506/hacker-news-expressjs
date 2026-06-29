import { randomUUID } from 'node:crypto';
import { redis } from '../cache/redis.js';
import { encrypt, decrypt } from './crypto.js';
import { sessionLog } from '../middleware/logging.js';

const PREFIX = 'session:';
const TTL = 30 * 24 * 60 * 60; // 30 days

export interface Session {
    id: string;
    hnUsername: string;
    hnCookieEnc: string;
    createdAt: number;
    lastSeenAt: number;
}

export const sessionStore = {
    async create(opts: { hnUsername: string; hnCookie: string }): Promise<Session> {
        const session: Session = {
            id: randomUUID(),
            hnUsername: opts.hnUsername,
            hnCookieEnc: encrypt(opts.hnCookie),
            createdAt: Date.now(),
            lastSeenAt: Date.now(),
        };
        await redis.set(PREFIX + session.id, session, { ex: TTL });
        sessionLog.info({ sessionId: session.id, user: session.hnUsername }, 'session created');
        return session;
    },

    async get(id: string): Promise<Session | null> {
        const session = await redis.get<Session>(PREFIX + id);
        if (!session) {
            sessionLog.debug({ sessionId: id }, 'session not found');
            return null;
        }
        session.lastSeenAt = Date.now();
        await redis.set(PREFIX + session.id, session, { ex: TTL });
        sessionLog.debug({ sessionId: id, user: session.hnUsername }, 'session accessed');
        return session;
    },

    async destroy(id: string): Promise<void> {
        await redis.del(PREFIX + id);
        sessionLog.info({ sessionId: id }, 'session destroyed');
    },

    decryptCookie(session: Session): string {
        sessionLog.debug({ sessionId: session.id }, 'decrypting cookie');
        return decrypt(session.hnCookieEnc);
    },
};
