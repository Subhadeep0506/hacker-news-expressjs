import { Controller, Get, Route, Tags, Query, SuccessResponse } from 'tsoa';
import { search, searchByDate } from '../hn/algolia.js';
import type { SearchResponse } from './types.js';

type SortMode = 'relevance' | 'date';

@Route('feed/search')
@Tags('Search')
export class SearchController extends Controller {

    /** Search HN stories via Algolia. Use sort=date for newest-first. */
    @Get()
    @SuccessResponse(200, 'Search results')
    public async search(
        /** @minLength 1 */
        @Query() query: string,
        @Query() sort: SortMode = 'relevance',
        /** @isInt @minimum 0 */
        @Query() page: number = 0,
        /** @isInt @minimum 1 @maximum 50 */
        @Query() limit: number = 20,
    ): Promise<SearchResponse> {
        const safePage = Math.max(0, Math.floor(page));
        const safeLimit = Math.min(50, Math.max(1, Math.floor(limit)));

        const fn = sort === 'date' ? searchByDate : search;
        const data = await fn(query, safePage, safeLimit, 'story');

        return {
            items: data.hits,
            total: data.nbHits,
            page: safePage,
            limit: safeLimit,
            totalPages: data.nbPages,
        };
    }
}
