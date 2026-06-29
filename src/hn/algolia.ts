import { anonClient } from './client.js';
import { cachedSingleFlight } from '../cache/memo.js';

const BASE = 'https://hn.algolia.com/api/v1';

export async function fetchItemWithComments(id: number) {
    return cachedSingleFlight(`algolia:item:${id}`, 30, async () => {
        const { data } = await anonClient.get(`${BASE}/items/${id}`);
        return data;
    });
}

export async function search(query: string, page = 0, hitsPerPage = 20) {
    const key = `search:${query}:${page}:${hitsPerPage}`;
    return cachedSingleFlight(key, 120, async () => {
        const { data } = await anonClient.get(`${BASE}/search`, {
            params: { query, page, hitsPerPage },
        });
        return data;
    });
}

export async function searchByDate(query: string, page = 0, hitsPerPage = 20) {
    const key = `search_date:${query}:${page}:${hitsPerPage}`;
    return cachedSingleFlight(key, 120, async () => {
        const { data } = await anonClient.get(`${BASE}/search_by_date`, {
            params: { query, page, hitsPerPage },
        });
        return data;
    });
}

export async function fetchUserSubmissions(username: string, page = 0, hitsPerPage = 20) {
    const key = `algolia:user_submissions:${username}:${page}:${hitsPerPage}`;
    return cachedSingleFlight(key, 120, async () => {
        const { data } = await anonClient.get(`${BASE}/search_by_date`, {
            params: { tags: `author_${username},story`, page, hitsPerPage },
        });
        return data;
    });
}

export async function fetchUserComments(username: string, page = 0, hitsPerPage = 20) {
    const key = `algolia:user_comments:${username}:${page}:${hitsPerPage}`;
    return cachedSingleFlight(key, 120, async () => {
        const { data } = await anonClient.get(`${BASE}/search_by_date`, {
            params: { tags: `author_${username},comment`, page, hitsPerPage },
        });
        return data;
    });
}
