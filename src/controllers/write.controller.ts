import {
    Controller, Post, Route, Tags, Body, Request,
    Security, Middlewares, Response, SuccessResponse,
} from 'tsoa';
import type { Request as ExRequest } from 'express';
import { writeLimiter } from '../middleware/ratelimit.js';
import { sessionClient } from '../hn/client.js';
import { sessionStore } from '../session/store.js';
import { postComment, vote, submitPost } from '../hn/writes.js';
import { writeLog } from '../middleware/logging.js';
import type { CommentRequest, VoteRequest, SubmitRequest, OkResponse, ErrorResponse } from './types.js';

@Route('write')
@Tags('Write')
@Security('BearerAuth')
@Middlewares(writeLimiter)
export class WriteController extends Controller {

    /** Post a comment on HN */
    @Post('comment')
    @SuccessResponse(200, 'Comment posted')
    @Response<ErrorResponse>(400, 'Validation error')
    @Response<ErrorResponse>(401, 'Not authenticated')
    @Response<ErrorResponse>(422, 'HN rejected the comment')
    @Response<ErrorResponse>(429, 'Rate limited')
    public async postComment(
        @Body() body: CommentRequest,
        @Request() req: ExRequest,
    ): Promise<OkResponse> {
        const session = (req as any).session;
        writeLog.info({ user: session.hnUsername, parentId: body.parentId }, 'comment request');
        const cookie = sessionStore.decryptCookie(session);
        const client = sessionClient(cookie);
        await postComment(client, body.parentId, body.text);
        return { ok: true };
    }

    /** Vote on an item */
    @Post('vote')
    @SuccessResponse(200, 'Vote cast')
    @Response<ErrorResponse>(400, 'Validation error')
    @Response<ErrorResponse>(401, 'Not authenticated')
    @Response<ErrorResponse>(429, 'Rate limited')
    @Response<ErrorResponse>(502, 'Vote link not found')
    public async voteOnItem(
        @Body() body: VoteRequest,
        @Request() req: ExRequest,
    ): Promise<OkResponse> {
        const session = (req as any).session;
        writeLog.info({ user: session.hnUsername, itemId: body.itemId, direction: body.direction }, 'vote request');
        const cookie = sessionStore.decryptCookie(session);
        const client = sessionClient(cookie);
        await vote(client, body.itemId, body.direction);
        return { ok: true };
    }

    /** Submit a new post to HN */
    @Post('submit')
    @SuccessResponse(200, 'Post submitted')
    @Response<ErrorResponse>(400, 'Validation error')
    @Response<ErrorResponse>(401, 'Not authenticated')
    @Response<ErrorResponse>(422, 'HN rejected the submission')
    @Response<ErrorResponse>(429, 'Rate limited')
    public async submitNewPost(
        @Body() body: SubmitRequest,
        @Request() req: ExRequest,
    ): Promise<OkResponse> {
        const session = (req as any).session;
        writeLog.info({ user: session.hnUsername, title: body.title }, 'submit request');
        const cookie = sessionStore.decryptCookie(session);
        const client = sessionClient(cookie);
        await submitPost(client, body);
        return { ok: true };
    }
}
