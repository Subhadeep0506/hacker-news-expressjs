import { Router } from 'express';
import { requireUIAuth, setFlash } from '../middleware.js';
import { sessionStore } from '../../session/store.js';
import { sessionClient } from '../../hn/client.js';
import { postComment, vote, submitPost } from '../../hn/writes.js';

export const writeRouter = Router();

writeRouter.get('/submit', requireUIAuth, (_req, res) => {
    res.render('pages/submit', {
        pageTitle: 'Submit',
        error: null,
        values: { title: '', url: '', text: '' },
    });
});

writeRouter.post('/submit', requireUIAuth, async (req, res) => {
    const { title, url, text } = req.body;

    if (!title?.trim()) {
        return res.render('pages/submit', {
            pageTitle: 'Submit',
            error: 'Title is required',
            values: { title, url, text },
        });
    }

    try {
        const session = res.locals.session;
        const cookie = sessionStore.decryptCookie(session);
        const client = sessionClient(cookie);
        await submitPost(client, { title: title.trim(), url: url?.trim() || undefined, text: text?.trim() || undefined });
        setFlash(res, 'success', 'Story submitted successfully!');
        res.redirect('/new');
    } catch (err: any) {
        res.render('pages/submit', {
            pageTitle: 'Submit',
            error: err.detail || err.message || 'Submission failed',
            values: { title, url, text },
        });
    }
});

writeRouter.post('/comment', requireUIAuth, async (req, res) => {
    const { parentId, text, storyId } = req.body;

    if (!parentId || !text?.trim()) {
        setFlash(res, 'error', 'Comment text is required');
        return res.redirect(req.headers.referer || '/');
    }

    try {
        const session = res.locals.session;
        const cookie = sessionStore.decryptCookie(session);
        const client = sessionClient(cookie);
        await postComment(client, parseInt(parentId), text.trim());
        setFlash(res, 'success', 'Comment posted!');
        res.redirect(`/story/${storyId || parentId}`);
    } catch (err: any) {
        setFlash(res, 'error', err.detail || err.message || 'Could not post comment');
        res.redirect(req.headers.referer || '/');
    }
});

writeRouter.post('/vote', requireUIAuth, async (req, res) => {
    const { itemId, direction } = req.body;

    try {
        const session = res.locals.session;
        const cookie = sessionStore.decryptCookie(session);
        const client = sessionClient(cookie);
        await vote(client, parseInt(itemId), direction === 'un' ? 'un' : 'up');

        if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
            return res.json({ ok: true });
        }
        res.redirect(req.headers.referer || '/');
    } catch (err: any) {
        if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
            return res.status(400).json({ ok: false, error: err.message });
        }
        setFlash(res, 'error', err.detail || err.message || 'Could not vote');
        res.redirect(req.headers.referer || '/');
    }
});
