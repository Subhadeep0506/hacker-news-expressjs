import { Router } from 'express';
import { search, searchByDate } from '../../hn/algolia.js';

export const searchRouter = Router();

searchRouter.get('/search', async (req, res, next) => {
    res.locals.feedType = 'search';
    try {
        const query = ((req.query.q as string) || '').trim();
        const sort = req.query.sort === 'date' ? 'date' : 'relevance';
        const page = Math.max(0, parseInt(req.query.page as string) || 0);
        const limit = 30;

        if (!query) {
            return res.render('pages/search', {
                pageTitle: 'Search',
                query: '',
                sort,
                items: [],
                total: 0,
                page: 0,
                limit,
                totalPages: 0,
            });
        }

        const fn = sort === 'date' ? searchByDate : search;
        const data = await fn(query, page, limit, 'story');

        const items = (data.hits || []).map((hit: any) => ({
            id: parseInt(hit.objectID, 10),
            title: hit.title || '[untitled]',
            url: hit.url || null,
            score: hit.points ?? 0,
            by: hit.author,
            time: hit.created_at_i,
            descendants: hit.num_comments ?? 0,
        }));

        res.render('pages/search', {
            pageTitle: `Search: ${query}`,
            query,
            sort,
            items,
            total: data.nbHits,
            page,
            limit,
            totalPages: data.nbPages,
        });
    } catch (err) {
        next(err);
    }
});
