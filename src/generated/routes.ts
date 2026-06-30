/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { WriteController } from './../controllers/write.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './../controllers/user.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SearchController } from './../controllers/search.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ItemController } from './../controllers/item.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { HealthController } from './../controllers/health.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { FeedController } from './../controllers/feed.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './../controllers/auth.controller.js';
import { expressAuthentication } from './../middleware/tsoaAuth.js';
// @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';

const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "OkResponse": {
        "dataType": "refObject",
        "properties": {
            "ok": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ErrorResponse": {
        "dataType": "refObject",
        "properties": {
            "error": {"dataType":"string","required":true},
            "message": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CommentRequest": {
        "dataType": "refObject",
        "properties": {
            "parentId": {"dataType":"integer","required":true,"validators":{"minimum":{"value":1}}},
            "text": {"dataType":"string","required":true,"validators":{"minLength":{"value":1},"maxLength":{"value":10000}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "VoteRequest": {
        "dataType": "refObject",
        "properties": {
            "itemId": {"dataType":"integer","required":true,"validators":{"minimum":{"value":1}}},
            "direction": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["up"]},{"dataType":"enum","enums":["un"]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SubmitRequest": {
        "dataType": "refObject",
        "properties": {
            "title": {"dataType":"string","required":true,"validators":{"minLength":{"value":1},"maxLength":{"value":80}}},
            "url": {"dataType":"string"},
            "text": {"dataType":"string","validators":{"maxLength":{"value":10000}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "HnUser": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "created": {"dataType":"double","required":true},
            "karma": {"dataType":"double","required":true},
            "about": {"dataType":"string"},
            "submitted": {"dataType":"array","array":{"dataType":"double"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AlgoliaStoryHit": {
        "dataType": "refObject",
        "properties": {
            "objectID": {"dataType":"string","required":true},
            "title": {"dataType":"string","required":true},
            "url": {"dataType":"string"},
            "author": {"dataType":"string","required":true},
            "points": {"dataType":"double","required":true},
            "num_comments": {"dataType":"integer","required":true},
            "story_text": {"dataType":"string"},
            "created_at": {"dataType":"string","required":true},
            "created_at_i": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserSubmissionsResponse": {
        "dataType": "refObject",
        "properties": {
            "items": {"dataType":"array","array":{"dataType":"refObject","ref":"AlgoliaStoryHit"},"required":true},
            "total": {"dataType":"double","required":true},
            "page": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
            "totalPages": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AlgoliaCommentHit": {
        "dataType": "refObject",
        "properties": {
            "objectID": {"dataType":"string","required":true},
            "author": {"dataType":"string","required":true},
            "comment_text": {"dataType":"string","required":true},
            "story_id": {"dataType":"integer","required":true},
            "story_title": {"dataType":"string"},
            "story_url": {"dataType":"string"},
            "parent_id": {"dataType":"integer","required":true},
            "created_at": {"dataType":"string","required":true},
            "created_at_i": {"dataType":"double","required":true},
            "points": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserCommentsResponse": {
        "dataType": "refObject",
        "properties": {
            "items": {"dataType":"array","array":{"dataType":"refObject","ref":"AlgoliaCommentHit"},"required":true},
            "total": {"dataType":"double","required":true},
            "page": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
            "totalPages": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SearchResponse": {
        "dataType": "refObject",
        "properties": {
            "items": {"dataType":"array","array":{"dataType":"refObject","ref":"AlgoliaStoryHit"},"required":true},
            "total": {"dataType":"double","required":true},
            "page": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
            "totalPages": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SortMode": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["relevance"]},{"dataType":"enum","enums":["date"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ItemResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["story"]},{"dataType":"enum","enums":["comment"]},{"dataType":"enum","enums":["job"]},{"dataType":"enum","enums":["poll"]},{"dataType":"enum","enums":["pollopt"]}],"required":true},
            "by": {"dataType":"string"},
            "time": {"dataType":"double","required":true},
            "text": {"dataType":"string"},
            "url": {"dataType":"string"},
            "title": {"dataType":"string"},
            "score": {"dataType":"double"},
            "descendants": {"dataType":"double"},
            "kids": {"dataType":"array","array":{"dataType":"double"}},
            "parent": {"dataType":"double"},
            "dead": {"dataType":"boolean"},
            "deleted": {"dataType":"boolean"},
            "children": {"dataType":"array","array":{"dataType":"any"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "HealthResponse": {
        "dataType": "refObject",
        "properties": {
            "ok": {"dataType":"boolean","required":true},
            "error": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "_HnItem": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"double","required":true},
            "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["story"]},{"dataType":"enum","enums":["comment"]},{"dataType":"enum","enums":["job"]},{"dataType":"enum","enums":["poll"]},{"dataType":"enum","enums":["pollopt"]}],"required":true},
            "by": {"dataType":"string"},
            "time": {"dataType":"double","required":true},
            "text": {"dataType":"string"},
            "url": {"dataType":"string"},
            "title": {"dataType":"string"},
            "score": {"dataType":"double"},
            "descendants": {"dataType":"double"},
            "kids": {"dataType":"array","array":{"dataType":"double"}},
            "parent": {"dataType":"double"},
            "dead": {"dataType":"boolean"},
            "deleted": {"dataType":"boolean"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FeedResponse": {
        "dataType": "refObject",
        "properties": {
            "items": {"dataType":"array","array":{"dataType":"refObject","ref":"_HnItem"},"required":true},
            "total": {"dataType":"double","required":true},
            "page": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FeedType": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["top"]},{"dataType":"enum","enums":["new"]},{"dataType":"enum","enums":["best"]},{"dataType":"enum","enums":["ask"]},{"dataType":"enum","enums":["show"]},{"dataType":"enum","enums":["job"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginResponse": {
        "dataType": "refObject",
        "properties": {
            "token": {"dataType":"string","required":true},
            "username": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginRequest": {
        "dataType": "refObject",
        "properties": {
            "username": {"dataType":"string","required":true,"validators":{"minLength":{"value":1}}},
            "password": {"dataType":"string","required":true,"validators":{"minLength":{"value":1}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserProfile": {
        "dataType": "refObject",
        "properties": {
            "username": {"dataType":"string","required":true},
            "karma": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "created": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "about": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "email": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "showdead": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "noprocrast": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "maxvisit": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "minaway": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "delay": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsWriteController_postComment: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"CommentRequest"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/write/comment',
            authenticateMiddleware([{"BearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(WriteController)),
            ...(fetchMiddlewares<RequestHandler>(WriteController.prototype.postComment)),

            async function WriteController_postComment(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWriteController_postComment, request, response });

                const controller = new WriteController();

              await templateService.apiHandler({
                methodName: 'postComment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWriteController_voteOnItem: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"VoteRequest"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/write/vote',
            authenticateMiddleware([{"BearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(WriteController)),
            ...(fetchMiddlewares<RequestHandler>(WriteController.prototype.voteOnItem)),

            async function WriteController_voteOnItem(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWriteController_voteOnItem, request, response });

                const controller = new WriteController();

              await templateService.apiHandler({
                methodName: 'voteOnItem',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWriteController_submitNewPost: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"SubmitRequest"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/write/submit',
            authenticateMiddleware([{"BearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(WriteController)),
            ...(fetchMiddlewares<RequestHandler>(WriteController.prototype.submitNewPost)),

            async function WriteController_submitNewPost(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWriteController_submitNewPost, request, response });

                const controller = new WriteController();

              await templateService.apiHandler({
                methodName: 'submitNewPost',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_getUser: Record<string, TsoaRoute.ParameterSchema> = {
                username: {"in":"path","name":"username","required":true,"dataType":"string"},
        };
        app.get('/user/:username',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getUser)),

            async function UserController_getUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getUser, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'getUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_getUserSubmissions: Record<string, TsoaRoute.ParameterSchema> = {
                username: {"in":"path","name":"username","required":true,"dataType":"string"},
                page: {"default":0,"in":"query","name":"page","dataType":"double"},
                limit: {"default":20,"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/user/:username/submissions',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getUserSubmissions)),

            async function UserController_getUserSubmissions(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getUserSubmissions, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'getUserSubmissions',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_getUserComments: Record<string, TsoaRoute.ParameterSchema> = {
                username: {"in":"path","name":"username","required":true,"dataType":"string"},
                page: {"default":0,"in":"query","name":"page","dataType":"double"},
                limit: {"default":20,"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/user/:username/comments',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getUserComments)),

            async function UserController_getUserComments(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getUserComments, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'getUserComments',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsSearchController_search: Record<string, TsoaRoute.ParameterSchema> = {
                query: {"in":"query","name":"query","required":true,"dataType":"string"},
                sort: {"default":"relevance","in":"query","name":"sort","ref":"SortMode"},
                page: {"default":0,"in":"query","name":"page","dataType":"double"},
                limit: {"default":20,"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/feed/search',
            ...(fetchMiddlewares<RequestHandler>(SearchController)),
            ...(fetchMiddlewares<RequestHandler>(SearchController.prototype.search)),

            async function SearchController_search(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSearchController_search, request, response });

                const controller = new SearchController();

              await templateService.apiHandler({
                methodName: 'search',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsItemController_getItem: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/item/:id',
            ...(fetchMiddlewares<RequestHandler>(ItemController)),
            ...(fetchMiddlewares<RequestHandler>(ItemController.prototype.getItem)),

            async function ItemController_getItem(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsItemController_getItem, request, response });

                const controller = new ItemController();

              await templateService.apiHandler({
                methodName: 'getItem',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsHealthController_healthCheck: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/health',
            ...(fetchMiddlewares<RequestHandler>(HealthController)),
            ...(fetchMiddlewares<RequestHandler>(HealthController.prototype.healthCheck)),

            async function HealthController_healthCheck(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsHealthController_healthCheck, request, response });

                const controller = new HealthController();

              await templateService.apiHandler({
                methodName: 'healthCheck',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsFeedController_getFeed: Record<string, TsoaRoute.ParameterSchema> = {
                type: {"in":"path","name":"type","required":true,"ref":"FeedType"},
                page: {"default":0,"in":"query","name":"page","dataType":"double"},
                limit: {"default":30,"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/feed/:type',
            ...(fetchMiddlewares<RequestHandler>(FeedController)),
            ...(fetchMiddlewares<RequestHandler>(FeedController.prototype.getFeed)),

            async function FeedController_getFeed(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsFeedController_getFeed, request, response });

                const controller = new FeedController();

              await templateService.apiHandler({
                methodName: 'getFeed',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_login: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"LoginRequest"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/auth/login',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.login)),

            async function AuthController_login(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_login, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_getMe: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/auth/me',
            authenticateMiddleware([{"BearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.getMe)),

            async function AuthController_getMe(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_getMe, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'getMe',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_logout: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/auth/logout',
            authenticateMiddleware([{"BearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.logout)),

            async function AuthController_logout(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_logout, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'logout',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await Promise.any(secMethodOrPromises);

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }

                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
