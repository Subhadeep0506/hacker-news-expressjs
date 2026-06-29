import type { AxiosInstance } from 'axios';
import { extractHmac, extractVoteLink, extractSubmitFields, extractErrorText } from './parse.js';
import { ApiError } from '../middleware/errors.js';
import { writeLog } from '../middleware/logging.js';

export const BASE_URL = 'https://news.ycombinator.com/';

export async function postComment(client: AxiosInstance, parentId: number, text: string) {
    writeLog.info({ parentId, textLength: text.length }, 'posting comment');
    const page = await client.get(`${BASE_URL}item?id=${parentId}`);
    const hmac = extractHmac(page.data);
    if (!hmac) {
        writeLog.error({ parentId }, 'hmac not found — session likely expired');
        throw new ApiError('session_expired');
    }
    writeLog.debug({ parentId, hmac: hmac.slice(0, 8) + '...' }, 'hmac extracted');

    const body = new URLSearchParams({
        parent: String(parentId),
        goto: `item?id=${parentId}`,
        hmac,
        text,
    });
    const r = await client.post(`${BASE_URL}comment`, body.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    if (r.status !== 302) {
        const errText = extractErrorText(r.data);
        writeLog.error({ parentId, status: r.status, hnError: errText }, 'comment rejected by HN');
        throw new ApiError('hn_rejected', errText);
    }
    writeLog.info({ parentId }, 'comment posted successfully');
}

export async function vote(client: AxiosInstance, itemId: number, dir: 'up' | 'un') {
    writeLog.info({ itemId, direction: dir }, 'voting');
    const page = await client.get(`${BASE_URL}item?id=${itemId}`);
    const href = extractVoteLink(page.data, itemId, dir);
    if (!href) {
        writeLog.error({ itemId, direction: dir }, 'vote link not found');
        throw new ApiError('vote_link_not_found');
    }
    writeLog.debug({ itemId, href }, 'vote link extracted');
    await client.get(`${BASE_URL}${href}`);
    writeLog.info({ itemId, direction: dir }, 'vote cast successfully');
}

export async function submitPost(
    client: AxiosInstance,
    opts: { title: string; url?: string; text?: string },
) {
    writeLog.info({ title: opts.title, hasUrl: !!opts.url, hasText: !!opts.text }, 'submitting post');
    const page = await client.get(`${BASE_URL}submit`);
    const fields = extractSubmitFields(page.data);
    if (!fields) {
        writeLog.error('submit form fields not found — session likely expired');
        throw new ApiError('session_expired');
    }
    writeLog.debug({ fnid: fields.fnid.slice(0, 8) + '...' }, 'submit fields extracted');

    const body = new URLSearchParams({
        fnid: fields.fnid,
        fnop: fields.fnop,
        title: opts.title,
        url: opts.url ?? '',
        text: opts.text ?? '',
    });
    const r = await client.post(`${BASE_URL}r`, body.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    if (r.status !== 302) {
        const errText = extractErrorText(r.data);
        writeLog.error({ title: opts.title, status: r.status, hnError: errText }, 'submission rejected by HN');
        throw new ApiError('hn_rejected', errText);
    }
    writeLog.info({ title: opts.title }, 'post submitted successfully');
}
