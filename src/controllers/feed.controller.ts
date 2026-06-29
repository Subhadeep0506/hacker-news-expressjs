import { Controller, Get, Route, Tags, Path, Query, Response, SuccessResponse } from 'tsoa';
import { fetchFeedIds, fetchItem, type FeedType } from '../hn/firebase.js';
import type { FeedResponse, ErrorResponse } from './types.js';

@Route('feed')
@Tags('Feed')
export class FeedController extends Controller {

    /** Get a paginated story feed */
    @Get('{type}')
    @SuccessResponse(200, 'Feed items')
    @Response<ErrorResponse>(400, 'Invalid feed type')
    public async getFeed(
        @Path() type: FeedType,
        @Query() page: number = 0,
        @Query() limit: number = 30,
    ): Promise<FeedResponse> {
        const safePage = Math.max(0, page);
        const safeLimit = Math.min(50, Math.max(1, limit));

        const ids = await fetchFeedIds(type);
        const sliced = ids.slice(safePage * safeLimit, (safePage + 1) * safeLimit);
        const items = await Promise.all(sliced.map(fetchItem));

        return {
            items: items.filter(Boolean),
            total: ids.length,
            page: safePage,
            limit: safeLimit,
        };
    }
}
