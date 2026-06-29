import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
import { hnAgent } from './agents.js';
import { hnLog } from '../middleware/logging.js';

function attachInterceptors(instance: ReturnType<typeof axios.create>, label: string) {
    instance.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
        (cfg as any)._startTime = Date.now();
        hnLog.debug({ label, method: cfg.method?.toUpperCase(), url: cfg.url }, 'upstream request');
        return cfg;
    });

    instance.interceptors.response.use(
        (res: AxiosResponse) => {
            const duration = Date.now() - ((res.config as any)._startTime ?? Date.now());
            hnLog.info({
                label,
                method: res.config.method?.toUpperCase(),
                url: res.config.url,
                status: res.status,
                durationMs: duration,
            }, 'upstream response');
            return res;
        },
        (err) => {
            const cfg = err.config as InternalAxiosRequestConfig | undefined;
            const duration = Date.now() - ((cfg as any)?._startTime ?? Date.now());
            hnLog.error({
                label,
                method: cfg?.method?.toUpperCase(),
                url: cfg?.url,
                status: err.response?.status,
                durationMs: duration,
                message: err.message,
            }, 'upstream error');
            return Promise.reject(err);
        },
    );

    return instance;
}

export const anonClient = attachInterceptors(
    axios.create({
        httpsAgent: hnAgent,
        timeout: 10_000,
        headers: { 'User-Agent': 'YourAppName/1.0 (+contact email)' },
    }),
    'anon',
);

export function sessionClient(cookie: string) {
    const jar = new CookieJar();
    jar.setCookieSync(cookie, 'https://news.ycombinator.com/');
    const instance = wrapper(axios.create({
        jar: jar as any,
        withCredentials: true,
        timeout: 10_000,
        maxRedirects: 0,
        validateStatus: (s: number) => s < 400 || s === 302,
        headers: { 'User-Agent': 'YourAppName/1.0 (+contact email)' },
    }));
    return attachInterceptors(instance, 'session');
}
