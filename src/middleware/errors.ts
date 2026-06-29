import type { ErrorRequestHandler } from 'express';
import { ValidateError } from 'tsoa';
import { AxiosError } from 'axios';
import { logger } from './logging.js';

export class ApiError extends Error {
    constructor(
        public code:
            | 'invalid_credentials'
            | 'session_expired'
            | 'rate_limited'
            | 'hn_unreachable'
            | 'hn_rejected'
            | 'validation_error'
            | 'vote_link_not_found'
            | 'no_session_cookie',
        message?: string,
    ) {
        super(message ?? code);
    }
}

const STATUS: Record<ApiError['code'], number> = {
    invalid_credentials: 401,
    session_expired: 401,
    rate_limited: 429,
    hn_unreachable: 502,
    hn_rejected: 422,
    validation_error: 400,
    vote_link_not_found: 502,
    no_session_cookie: 502,
};

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
    if (err instanceof ValidateError) {
        logger.warn({
            method: req.method,
            url: req.url,
            fields: err.fields,
        }, 'validation error');
        res.status(422).json({
            error: 'validation_error',
            message: 'Validation failed',
            details: err.fields,
        });
        return;
    }

    if (err instanceof ApiError) {
        logger.warn({
            code: err.code,
            status: STATUS[err.code],
            method: req.method,
            url: req.url,
            message: err.message,
        }, `api error: ${err.code}`);
        res.status(STATUS[err.code]).json({ error: err.code, message: err.message });
        return;
    }

    if (err.message === 'no_token' || err.message === 'session_expired' || err.message === 'invalid_token') {
        logger.warn({ ip: req.ip, method: req.method, url: req.url }, `auth error: ${err.message}`);
        res.status(401).json({ error: err.message });
        return;
    }

    if (err instanceof AxiosError) {
        logger.error({
            method: req.method,
            url: req.url,
            upstream: {
                method: err.config?.method?.toUpperCase(),
                url: err.config?.url,
                status: err.response?.status,
                statusText: err.response?.statusText,
                data: typeof err.response?.data === 'string' ? err.response.data.slice(0, 200) : undefined,
            },
            message: err.message,
        }, 'upstream request failed');
        res.status(502).json({ error: 'hn_unreachable', message: 'Upstream request failed' });
        return;
    }

    logger.error({
        err: { message: err.message, name: err.name, stack: err.stack },
        method: req.method,
        url: req.url,
    }, 'unhandled error');
    res.status(500).json({ error: 'internal' });
};
