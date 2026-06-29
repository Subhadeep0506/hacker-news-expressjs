import { Router } from 'express';
import { loadUser, flashMiddleware } from './middleware.js';
import { feedRouter } from './routes/feed.routes.js';
import { itemRouter } from './routes/item.routes.js';
import { userRouter } from './routes/user.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { writeRouter } from './routes/write.routes.js';

export const uiRouter = Router();

uiRouter.use(loadUser);
uiRouter.use(flashMiddleware);
uiRouter.use(authRouter);
uiRouter.use(writeRouter);
uiRouter.use(itemRouter);
uiRouter.use(userRouter);
uiRouter.use(feedRouter);

uiRouter.use((err: any, _req: any, res: any, _next: any) => {
    const status = err.status || err.statusCode || 500;
    res.status(status).render('pages/error', {
        pageTitle: `Error ${status}`,
        status,
        message: err.message || 'Something went wrong',
    });
});
