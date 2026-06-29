import {
    Controller, Post, Get, Route, Tags, Body, Request,
    Security, Middlewares, Response, SuccessResponse,
} from 'tsoa';
import type { Request as ExRequest } from 'express';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { sessionStore } from '../session/store.js';
import { loginLimiter } from '../middleware/ratelimit.js';
import { authLog } from '../middleware/logging.js';
import { fetchUser } from '../hn/firebase.js';
import { sessionClient } from '../hn/client.js';
import { parseOwnProfile } from '../hn/parse.js';
import { ApiError } from '../middleware/errors.js';
import type { LoginRequest, LoginResponse, UserProfile, OkResponse, ErrorResponse } from './types.js';

@Route('auth')
@Tags('Auth')
export class AuthController extends Controller {

    /** Log in with HN credentials. Rate limited to 50 attempts per 15 minutes. */
    @Post('login')
    @Middlewares(loginLimiter)
    @SuccessResponse(200, 'Login successful')
    @Response<ErrorResponse>(401, 'Invalid credentials')
    @Response<ErrorResponse>(429, 'Rate limited')
    @Response<ErrorResponse>(502, 'HN unreachable')
    public async login(
        @Body() body: LoginRequest,
        @Request() req: ExRequest,
    ): Promise<LoginResponse> {
        const { username, password } = body;
        authLog.info({ user: username, ip: req.ip }, 'login attempt');

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
            authLog.warn({ user: username, ip: req.ip }, 'login failed — invalid credentials');
            throw new ApiError('invalid_credentials', 'Invalid username or password');
        }

        if (r.status === 429) {
            authLog.warn({ user: username, ip: req.ip }, 'login failed — HN rate limited our IP');
            throw new ApiError('rate_limited', 'HN is rate limiting requests, try again later');
        }

        if (r.status >= 500) {
            authLog.error({ user: username, status: r.status }, 'login failed — HN returned server error');
            throw new ApiError('hn_unreachable', 'HN returned an error, try again later');
        }

        const cookies = await jar.getCookies('https://news.ycombinator.com/');
        const userCookie = cookies.find((c) => c.key === 'user');
        if (!userCookie) {
            authLog.error({ user: username }, 'login failed — HN returned no session cookie (possible CAPTCHA)');
            throw new ApiError('no_session_cookie');
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
        authLog.info({ user: username, sessionId: session.id }, 'login successful');
        return { token, username };
    }

    /** Get current user's full profile (public + private fields) */
    @Get('me')
    @Security('BearerAuth')
    @SuccessResponse(200, 'Current user')
    @Response<ErrorResponse>(401, 'Not authenticated')
    public async getMe(@Request() req: ExRequest): Promise<UserProfile> {
        const session = (req as any).session;
        authLog.debug({ user: session.hnUsername }, '/me accessed');

        const cookie = sessionStore.decryptCookie(session);
        const [firebaseData, htmlProfile] = await Promise.all([
            fetchUser(session.hnUsername).catch(() => null),
            sessionClient(cookie)
                .get('https://news.ycombinator.com/user', { params: { id: session.hnUsername } })
                .then((r: any) => parseOwnProfile(r.data))
                .catch((): Record<string, string> => ({})),
        ]);

        return {
            username: session.hnUsername,
            karma: firebaseData?.karma ?? null,
            created: firebaseData?.created ?? null,
            about: htmlProfile.about ?? firebaseData?.about ?? null,
            email: htmlProfile.email ?? null,
            showdead: htmlProfile.showdead ?? null,
            noprocrast: htmlProfile.noprocrast ?? null,
            maxvisit: htmlProfile.maxvisit ?? null,
            minaway: htmlProfile.minaway ?? null,
            delay: htmlProfile.delay ?? null,
        };
    }

    /** Log out (destroys server-side session) */
    @Post('logout')
    @Security('BearerAuth')
    @SuccessResponse(200, 'Logged out')
    @Response<ErrorResponse>(401, 'Not authenticated')
    public async logout(@Request() req: ExRequest): Promise<OkResponse> {
        const session = (req as any).session;
        authLog.info({ user: session.hnUsername, sessionId: session.id }, 'logout');
        await sessionStore.destroy(session.id);
        return { ok: true };
    }
}
