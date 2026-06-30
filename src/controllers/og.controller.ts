import { Controller, Get, Route, Tags, Query, Response, SuccessResponse } from 'tsoa';
import { getOgImage } from '../services/og.js';
import type { OgImageResponse, ErrorResponse } from './types.js';

@Route('og-image')
@Tags('OG Image')
export class OgImageController extends Controller {

    /** Extract the Open Graph image URL from a web page. Cached for 24 hours. */
    @Get()
    @SuccessResponse(200, 'OG image URL or null')
    @Response<ErrorResponse>(400, 'Invalid or disallowed URL')
    public async getOgImage(
        /** @minLength 1 */
        @Query() url: string,
    ): Promise<OgImageResponse> {
        const image = await getOgImage(url);
        return { image };
    }
}
