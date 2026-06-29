import { anonClient } from './client.js';
import { cachedSingleFlight } from '../cache/memo.js';

const BASE = 'https://hacker-news.firebaseio.com/v0';

export type FeedType = 'top' | 'new' | 'best' | 'ask' | 'show' | 'job';

const FEED_PATHS: Record<FeedType, string> = {
    top: 'topstories',
    new: 'newstories',
    best: 'beststories',
    ask: 'askstories',
    show: 'showstories',
    job: 'jobstories',
};

export async function fetchFeedIds(type: FeedType): Promise<number[]> {
    return cachedSingleFlight(`feed:${type}`, 60, async () => {
        const { data } = await anonClient.get<number[]>(`${BASE}/${FEED_PATHS[type]}.json`);
        return data;
    });
}

export async function fetchItem(id: number) {
    return cachedSingleFlight(`item:${id}`, 30, async () => {
        const { data } = await anonClient.get(`${BASE}/item/${id}.json`);
        return data;
    });
}

export async function fetchUser(username: string) {
    return cachedSingleFlight(`user:${username}`, 300, async () => {
        const { data } = await anonClient.get(`${BASE}/user/${username}.json`);
        return data;
    });
}
