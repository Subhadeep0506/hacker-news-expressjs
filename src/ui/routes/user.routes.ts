import { Router } from 'express';
import { fetchUser } from '../../hn/firebase.js';
import { fetchUserSubmissions, fetchUserComments } from '../../hn/algolia.js';

export const userRouter = Router();

userRouter.get('/profile/:username', async (req, res, next) => {
    try {
        const { username } = req.params;
        const tab = (req.query.tab as string) || 'submissions';
        const page = Math.max(0, parseInt(req.query.page as string) || 0);
        const limit = 20;

        const user = await fetchUser(username);
        if (!user) {
            return res.status(404).render('pages/error', {
                pageTitle: 'User Not Found',
                status: 404,
                message: `User "${username}" not found`,
            });
        }

        let tabData: any = { items: [], total: 0, totalPages: 0 };
        if (tab === 'comments') {
            const result = await fetchUserComments(username, page, limit);
            tabData = {
                items: result.hits || [],
                total: result.nbHits || 0,
                totalPages: result.nbPages || 0,
            };
        } else {
            const result = await fetchUserSubmissions(username, page, limit);
            tabData = {
                items: result.hits || [],
                total: result.nbHits || 0,
                totalPages: result.nbPages || 0,
            };
        }

        res.render('pages/user', {
            pageTitle: `${username}'s Profile`,
            user,
            tab,
            tabData,
            page,
        });
    } catch (err) {
        next(err);
    }
});
