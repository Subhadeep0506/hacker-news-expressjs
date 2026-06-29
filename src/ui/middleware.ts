import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { sessionStore, type Session } from '../session/store.js';
import { timeAgo, extractDomain, pluralize, formatDate } from './helpers.js';

export async function loadUser(req: Request, res: Response, next: NextFunction) {
    res.locals.currentUser = null;
    res.locals.session = null;
    res.locals.timeAgo = timeAgo;
    res.locals.extractDomain = extractDomain;
    res.locals.pluralize = pluralize;
    res.locals.formatDate = formatDate;
    res.locals.feedType = null;

    const token = req.cookies?.hn_token;
    if (!token) return next();

    try {
        const payload = jwt.verify(token, config.JWT_SECRET) as { sub: string; jti: string };
        const session = await sessionStore.get(payload.jti);
        if (session) {
            res.locals.currentUser = { username: session.hnUsername };
            res.locals.session = session;
        }
    } catch {
        // invalid/expired token — clear it
        res.clearCookie('hn_token');
    }
    next();
}

export function requireUIAuth(req: Request, res: Response, next: NextFunction) {
    if (!res.locals.currentUser) {
        const redirect = encodeURIComponent(req.originalUrl);
        return res.redirect(`/login?redirect=${redirect}`);
    }
    next();
}

export function flashMiddleware(req: Request, res: Response, next: NextFunction) {
    const raw = req.cookies?.flash;
    if (raw) {
        try {
            res.locals.flash = JSON.parse(raw);
        } catch {
            res.locals.flash = null;
        }
        res.clearCookie('flash');
    } else {
        res.locals.flash = null;
    }
    next();
}

export function setFlash(res: Response, type: 'success' | 'error', message: string) {
    res.cookie('flash', JSON.stringify({ type, message }), {
        httpOnly: true,
        maxAge: 10_000,
    });
}
