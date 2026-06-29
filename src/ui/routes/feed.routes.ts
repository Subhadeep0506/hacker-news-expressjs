import { Router } from 'express';
import { fetchFeedIds, fetchItem, type FeedType } from '../../hn/firebase.js';

export const feedRouter = Router();

const VALID_TYPES = ['top', 'new', 'best', 'ask', 'show', 'jobs'] as const;
type UIFeedType = (typeof VALID_TYPES)[number];

function toApiFeedType(type: UIFeedType): FeedType {
    return type === 'jobs' ? 'job' : type;
}

const FEED_TITLES: Record<UIFeedType, string> = {
    top: 'Top Stories',
    new: 'New Stories',
    best: 'Best Stories',
    ask: 'Ask HN',
    show: 'Show HN',
    jobs: 'Jobs',
};

feedRouter.get('/', (_req, res) => {
    res.redirect('/top');
});

const VALID_SET = new Set<string>(VALID_TYPES);

feedRouter.get('/:type', async (req, res, next) => {
    const type = req.params.type;
    if (!VALID_SET.has(type)) return next();

    try {
        const feedType = type as UIFeedType;
        const page = Math.max(0, parseInt(req.query.page as string) || 0);
        const limit = 30;

        const allIds = await fetchFeedIds(toApiFeedType(feedType));
        const totalPages = Math.ceil(allIds.length / limit);
        const pageIds = allIds.slice(page * limit, (page + 1) * limit);

        const items = await Promise.all(pageIds.map((id) => fetchItem(id)));
        const validItems = items.filter(Boolean);

        res.locals.feedType = feedType;
        res.render('pages/feed', {
            pageTitle: FEED_TITLES[feedType],
            feedTitle: FEED_TITLES[feedType],
            items: validItems,
            feedType,
            page,
            totalPages,
            startRank: page * limit + 1,
        });
    } catch (err) {
        next(err);
    }
});
