import * as cheerio from 'cheerio';

export function extractHmac(html: string): string | null {
    const $ = cheerio.load(html);
    return $('input[name="hmac"]').attr('value') ?? null;
}

export function extractVoteLink(html: string, itemId: number, dir: 'up' | 'un'): string | null {
    const $ = cheerio.load(html);
    return $(`#${dir}_${itemId}`).attr('href') ?? null;
}

export function extractSubmitFields(html: string): { fnid: string; fnop: string } | null {
    const $ = cheerio.load(html);
    const fnid = $('input[name="fnid"]').attr('value');
    const fnop = $('input[name="fnop"]').attr('value');
    if (!fnid || !fnop) return null;
    return { fnid, fnop };
}

export function extractErrorText(html: string): string {
    const $ = cheerio.load(html);
    return $('body').text().slice(0, 200).trim();
}

export function parseOwnProfile(html: string): Record<string, string> {
    const $ = cheerio.load(html);
    const profile: Record<string, string> = {};
    $('form table tr').each((_, row) => {
        const label = $(row).find('td:first-child').text().replace(/:$/, '').trim().toLowerCase();
        if (!label) return;
        const input = $(row).find('td:nth-child(2) input[type="text"], td:nth-child(2) input[type="hidden"]');
        if (input.length) {
            profile[label] = input.val() as string ?? '';
            return;
        }
        const textarea = $(row).find('td:nth-child(2) textarea');
        if (textarea.length) {
            profile[label] = textarea.val() as string ?? '';
            return;
        }
        const checkbox = $(row).find('td:nth-child(2) input[type="checkbox"]');
        if (checkbox.length) {
            profile[label] = checkbox.is(':checked') ? 'yes' : 'no';
            return;
        }
        const text = $(row).find('td:nth-child(2)').text().trim();
        if (text) {
            profile[label] = text;
        }
    });
    return profile;
}
