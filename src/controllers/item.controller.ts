import { Controller, Get, Route, Tags, Path, Response, SuccessResponse } from 'tsoa';
import { fetchItem } from '../hn/firebase.js';
import { fetchItemWithComments } from '../hn/algolia.js';
import type { ItemResponse, ErrorResponse } from './types.js';

@Route('item')
@Tags('Item')
export class ItemController extends Controller {

    /** Get an item with its full comment tree */
    @Get('{id}')
    @SuccessResponse(200, 'Item with children')
    @Response<ErrorResponse>(400, 'Invalid item ID')
    @Response<ErrorResponse>(404, 'Item not found')
    public async getItem(
        /**
         * @isInt
         * @minimum 1
         */
        @Path() id: number,
    ): Promise<ItemResponse> {
        const [meta, thread] = await Promise.all([
            fetchItem(id),
            fetchItemWithComments(id),
        ]);

        if (!meta) {
            this.setStatus(404);
            return { error: 'not_found' } as any;
        }

        return { ...meta, children: thread?.children ?? [] };
    }
}
