import type { HnItem as _HnItem } from '../types.js';

export type { HnItem, HnUser } from '../types.js';
export type { FeedType } from '../hn/firebase.js';

export interface LoginRequest {
    /** @minLength 1 */
    username: string;
    /** @minLength 1 */
    password: string;
}

export interface LoginResponse {
    token: string;
    username: string;
}

export interface CommentRequest {
    /**
     * @isInt
     * @minimum 1
     */
    parentId: number;
    /**
     * @minLength 1
     * @maxLength 10000
     */
    text: string;
}

export interface VoteRequest {
    /**
     * @isInt
     * @minimum 1
     */
    itemId: number;
    direction: 'up' | 'un';
}

export interface SubmitRequest {
    /**
     * @minLength 1
     * @maxLength 80
     */
    title: string;
    url?: string;
    /** @maxLength 10000 */
    text?: string;
}

export interface FeedResponse {
    items: _HnItem[];
    total: number;
    page: number;
    limit: number;
}

export interface ItemResponse {
    id: number;
    type: 'story' | 'comment' | 'job' | 'poll' | 'pollopt';
    by?: string;
    time: number;
    text?: string;
    url?: string;
    title?: string;
    score?: number;
    descendants?: number;
    kids?: number[];
    parent?: number;
    dead?: boolean;
    deleted?: boolean;
    children: any[];
}

export interface UserProfile {
    username: string;
    karma: number | null;
    created: number | null;
    about: string | null;
    email: string | null;
    showdead: string | null;
    noprocrast: string | null;
    maxvisit: string | null;
    minaway: string | null;
    delay: string | null;
}

export interface OkResponse {
    ok: boolean;
}

export interface ErrorResponse {
    error: string;
    message?: string;
}

export interface HealthResponse {
    ok: boolean;
    error?: string;
}

export interface OgImageResponse {
    image: string | null;
}

export interface AlgoliaStoryHit {
    objectID: string;
    title: string;
    url?: string;
    author: string;
    points: number;
    /** @isInt */
    num_comments: number;
    story_text?: string;
    created_at: string;
    created_at_i: number;
}

export interface AlgoliaCommentHit {
    objectID: string;
    author: string;
    comment_text: string;
    /** @isInt */
    story_id: number;
    story_title?: string;
    story_url?: string;
    /** @isInt */
    parent_id: number;
    created_at: string;
    created_at_i: number;
    points: number;
}

export interface SearchResponse {
    items: AlgoliaStoryHit[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface UserSubmissionsResponse {
    items: AlgoliaStoryHit[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface UserCommentsResponse {
    items: AlgoliaCommentHit[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
