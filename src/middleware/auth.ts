import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { sessionStore } from '../session/store.js';
import { authLog } from './logging.js';

export const requireSession: RequestHandler = async (req, res, next) => {
    try {
        const h = req.headers.authorization;
        if (!h?.startsWith('Bearer ')) {
            authLog.warn({ ip: req.ip, path: req.path }, 'missing bearer token');
            res.status(401).json({ error: 'no_token' });
            return;
        }
        const payload = jwt.verify(h.slice(7), config.JWT_SECRET) as { sub: string; jti: string };
        const session = await sessionStore.get(payload.jti);
        if (!session) {
            authLog.warn({ user: payload.sub, jti: payload.jti }, 'session expired or not found');
            res.status(401).json({ error: 'session_expired' });
            return;
        }
        (req as any).session = session;
        authLog.debug({ user: session.hnUsername, sessionId: session.id }, 'authenticated');
        next();
    } catch (err) {
        authLog.warn({ ip: req.ip, err }, 'invalid token');
        res.status(401).json({ error: 'invalid_token' });
    }
};
