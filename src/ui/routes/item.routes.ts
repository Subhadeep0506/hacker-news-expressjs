import { Router } from 'express';
import { fetchItem } from '../../hn/firebase.js';
import { fetchItemWithComments } from '../../hn/algolia.js';

export const itemRouter = Router();

itemRouter.get('/story/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id < 1) {
            return res.status(404).render('pages/error', {
                pageTitle: 'Not Found',
                status: 404,
                message: 'Story not found',
            });
        }

        const [item, algoliaItem] = await Promise.all([
            fetchItem(id),
            fetchItemWithComments(id).catch(() => null),
        ]);

        if (!item) {
            return res.status(404).render('pages/error', {
                pageTitle: 'Not Found',
                status: 404,
                message: 'Story not found',
            });
        }

        const children = algoliaItem?.children ?? [];

        res.render('pages/item', {
            pageTitle: item.title || `Item ${id}`,
            item,
            children,
        });
    } catch (err) {
        next(err);
    }
});
