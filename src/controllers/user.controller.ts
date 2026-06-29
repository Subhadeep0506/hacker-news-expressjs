import { Controller, Get, Route, Tags, Path, Query, Response, SuccessResponse } from 'tsoa';
import { fetchUser } from '../hn/firebase.js';
import { fetchUserSubmissions, fetchUserComments } from '../hn/algolia.js';
import type { HnUser, ErrorResponse, UserSubmissionsResponse, UserCommentsResponse } from './types.js';

@Route('user')
@Tags('User')
export class UserController extends Controller {

    /** Get a public user profile from HN. Cached for 5 minutes. */
    @Get('{username}')
    @SuccessResponse(200, 'User profile')
    @Response<ErrorResponse>(404, 'User not found')
    public async getUser(@Path() username: string): Promise<HnUser> {
        const user = await fetchUser(username);
        if (!user) {
            this.setStatus(404);
            return { error: 'not_found' } as any;
        }
        return user;
    }

    /** Get a paginated list of a user's story submissions, sorted by date (most recent first). */
    @Get('{username}/submissions')
    @SuccessResponse(200, 'User submissions')
    public async getUserSubmissions(
        @Path() username: string,
        /** @isInt @minimum 0 */
        @Query() page: number = 0,
        /** @isInt @minimum 1 @maximum 50 */
        @Query() limit: number = 20,
    ): Promise<UserSubmissionsResponse> {
        const safePage = Math.max(0, Math.floor(page));
        const safeLimit = Math.min(50, Math.max(1, Math.floor(limit)));

        const data = await fetchUserSubmissions(username, safePage, safeLimit);

        return {
            items: data.hits,
            total: data.nbHits,
            page: safePage,
            limit: safeLimit,
            totalPages: data.nbPages,
        };
    }

    /** Get a paginated list of a user's comments, sorted by date (most recent first). */
    @Get('{username}/comments')
    @SuccessResponse(200, 'User comments')
    public async getUserComments(
        @Path() username: string,
        /** @isInt @minimum 0 */
        @Query() page: number = 0,
        /** @isInt @minimum 1 @maximum 50 */
        @Query() limit: number = 20,
    ): Promise<UserCommentsResponse> {
        const safePage = Math.max(0, Math.floor(page));
        const safeLimit = Math.min(50, Math.max(1, Math.floor(limit)));

        const data = await fetchUserComments(username, safePage, safeLimit);

        return {
            items: data.hits,
            total: data.nbHits,
            page: safePage,
            limit: safeLimit,
            totalPages: data.nbPages,
        };
    }
}
