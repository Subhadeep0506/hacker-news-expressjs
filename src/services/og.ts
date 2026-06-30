import { getLinkPreview } from 'link-preview-js';
import { cached } from '../cache/memo.js';
import { ApiError } from '../middleware/errors.js';
import { ogLog } from '../middleware/logging.js';

const PRIVATE_HOST_PATTERNS = [
    /^localhost$/i,
    /^127\./,
    /^10\./,
    /^172\.(1[6-9]|2\d|3[01])\./,
    /^192\.168\./,
    /^0\.0\.0\.0$/,
    /^::1$/,
    /^\[::1\]$/,
    /^0:0:0:0:0:0:0:1$/,
    /\.local$/i,
    /\.internal$/i,
];

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif)$/i;

const YOUTUBE_HOST = /^(www\.|m\.)?youtube\.com$/i;
const YT_ID = /^[\w-]{11}$/;

function validateUrl(raw: string): URL {
    let url: URL;
    try {
        url = new URL(raw);
    } catch {
        throw new ApiError('validation_error', 'Invalid URL');
    }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        throw new ApiError('validation_error', 'Only http and https URLs are allowed');
    }
    if (PRIVATE_HOST_PATTERNS.some((p) => p.test(url.hostname))) {
        throw new ApiError('validation_error', 'Private or internal URLs are not allowed');
    }
    return url;
}

function extractYouTubeImage(url: URL): string | null {
    let videoId: string | null = null;

    if (YOUTUBE_HOST.test(url.hostname)) {
        if (url.pathname === '/watch') {
            videoId = url.searchParams.get('v');
        } else {
            const match = url.pathname.match(/^\/(embed|shorts)\/([\w-]+)/);
            if (match) videoId = match[2];
        }
    } else if (url.hostname === 'youtu.be') {
        const seg = url.pathname.slice(1).split('/')[0];
        if (seg) videoId = seg;
    }

    if (videoId && YT_ID.test(videoId)) {
        return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    }
    return null;
}

function isDirectImageUrl(url: URL): boolean {
    return IMAGE_EXT.test(url.pathname);
}

async function fetchOgImage(url: URL): Promise<{ image: string | null }> {
    try {
        const preview = await getLinkPreview(url.href, {
            timeout: 5000,
            followRedirects: 'follow',
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; HNCompanionBot/1.0)',
            },
        });

        if ('images' in preview && preview.images.length > 0) {
            const raw = preview.images[0];
            try {
                const resolved = new URL(raw, url.href);
                if (resolved.protocol === 'http:' || resolved.protocol === 'https:') {
                    ogLog.debug({ url: url.href, image: resolved.href }, 'og image found');
                    return { image: resolved.href };
                }
            } catch {
                // invalid image URL, fall through
            }
        }

        ogLog.debug({ url: url.href }, 'no og image found');
        return { image: null };
    } catch (err) {
        ogLog.warn({ url: url.href, err }, 'og image fetch failed');
        return { image: null };
    }
}

const OG_CACHE_TTL = 86400; // 24 hours

export async function getOgImage(rawUrl: string): Promise<string | null> {
    const url = validateUrl(rawUrl);

    const ytImage = extractYouTubeImage(url);
    if (ytImage) return ytImage;

    if (isDirectImageUrl(url)) return url.href;

    const result = await cached<{ image: string | null }>(
        `og:${url.href}`,
        OG_CACHE_TTL,
        () => fetchOgImage(url),
    );
    return result.image;
}
