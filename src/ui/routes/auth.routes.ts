import { Router } from 'express';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { config } from '../../config.js';
import { sessionStore } from '../../session/store.js';
import { setFlash } from '../middleware.js';
import { requireUIAuth } from '../middleware.js';

export const authRouter = Router();

authRouter.get('/login', (req, res) => {
    if (res.locals.currentUser) return res.redirect('/');
    res.render('pages/login', {
        pageTitle: 'Login',
        error: null,
        redirect: req.query.redirect || '',
    });
});

authRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const redirect = req.body.redirect || '/';

    if (!username || !password) {
        return res.render('pages/login', {
            pageTitle: 'Login',
            error: 'Username and password are required',
            redirect,
        });
    }

    try {
        const jar = new CookieJar();
        const client = wrapper(axios.create({
            jar: jar as any,
            withCredentials: true,
            maxRedirects: 0,
            validateStatus: () => true,
        }));

        const formBody = new URLSearchParams({ acct: username, pw: password, goto: 'news' });
        const r = await client.post('https://news.ycombinator.com/login', formBody.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'HN-Companion/1.0',
            },
        });

        if (typeof r.data === 'string' && /Bad login/i.test(r.data)) {
            return res.render('pages/login', {
                pageTitle: 'Login',
                error: 'Invalid username or password',
                redirect,
            });
        }

        const cookies = await jar.getCookies('https://news.ycombinator.com/');
        const userCookie = cookies.find((c) => c.key === 'user');
        if (!userCookie) {
            return res.render('pages/login', {
                pageTitle: 'Login',
                error: 'Login failed — HN may require a CAPTCHA. Try logging in on news.ycombinator.com first.',
                redirect,
            });
        }

        const session = await sessionStore.create({
            hnUsername: username,
            hnCookie: `user=${userCookie.value}`,
        });

        const token = jwt.sign(
            { sub: username, jti: session.id },
            config.JWT_SECRET,
            { expiresIn: '30d' },
        );

        res.cookie('hn_token', token, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        setFlash(res, 'success', `Welcome back, ${username}!`);
        res.redirect(redirect || '/');
    } catch {
        res.render('pages/login', {
            pageTitle: 'Login',
            error: 'Could not reach Hacker News. Please try again.',
            redirect,
        });
    }
});

authRouter.post('/logout', requireUIAuth, async (_req, res) => {
    const session = res.locals.session;
    if (session) {
        await sessionStore.destroy(session.id);
    }
    res.clearCookie('hn_token');
    setFlash(res, 'success', 'You have been logged out.');
    res.redirect('/');
});
