import type { Request } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { sessionStore } from '../session/store.js';
import { authLog } from './logging.js';

export async function expressAuthentication(
    request: Request,
    securityName: string,
    _scopes?: string[],
): Promise<any> {
    if (securityName !== 'BearerAuth') {
        throw new Error(`Unknown security: ${securityName}`);
    }

    const h = request.headers.authorization;
    if (!h?.startsWith('Bearer ')) {
        authLog.warn({ ip: request.ip, path: request.path }, 'missing bearer token');
        throw new Error('no_token');
    }

    const payload = jwt.verify(h.slice(7), config.JWT_SECRET) as { sub: string; jti: string };
    const session = await sessionStore.get(payload.jti);
    if (!session) {
        authLog.warn({ user: payload.sub, jti: payload.jti }, 'session expired or not found');
        throw new Error('session_expired');
    }

    authLog.debug({ user: session.hnUsername, sessionId: session.id }, 'authenticated');
    (request as any).session = session;
    return session;
}
