const SECOND = 1;
const MINUTE = 60;
const HOUR = 3600;
const DAY = 86400;
const YEAR = 365 * DAY;

export function timeAgo(unixSeconds: number): string {
    const diff = Math.floor(Date.now() / 1000) - unixSeconds;
    if (diff < MINUTE) return `${diff} second${diff !== 1 ? 's' : ''} ago`;
    if (diff < HOUR) { const m = Math.floor(diff / MINUTE); return `${m} minute${m !== 1 ? 's' : ''} ago`; }
    if (diff < DAY) { const h = Math.floor(diff / HOUR); return `${h} hour${h !== 1 ? 's' : ''} ago`; }
    if (diff < YEAR) { const d = Math.floor(diff / DAY); return `${d} day${d !== 1 ? 's' : ''} ago`; }
    const y = Math.floor(diff / YEAR);
    return `${y} year${y !== 1 ? 's' : ''} ago`;
}

export function extractDomain(url: string | undefined): string | null {
    if (!url) return null;
    try {
        return new URL(url).hostname.replace(/^www\./, '');
    } catch {
        return null;
    }
}

export function pluralize(n: number, word: string): string {
    return `${n} ${word}${n !== 1 ? 's' : ''}`;
}

export function formatDate(unixSeconds: number): string {
    return new Date(unixSeconds * 1000).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    });
}
