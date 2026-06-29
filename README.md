# Hacker News Companion API

Proxy/session layer between a Flutter client and news.ycombinator.com. Handles authentication, feed aggregation, commenting, voting, and submissions via HN's Firebase API, Algolia API, and form scraping.

## Setup

```bash
npm install
```

Create a `.env` file:

```env
JWT_SECRET=your-secret-min-32-chars
SESSION_KEY=64-hex-char-aes256-key
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
PORT=8080
LOG_LEVEL=info
```

## Running

```bash
npm run dev       # dev server (tsx, auto-generates tsoa routes)
npm run build     # compile to dist/
npm start         # run compiled build
```

API docs available at `http://localhost:8080/docs` (Swagger UI).

## Development

The project uses [tsoa](https://github.com/lukeautry/tsoa) for auto-generated OpenAPI spec and Express route registration. Controllers live in `src/controllers/`, decorated with `@Route`, `@Get`, `@Post`, `@Security`, etc.

After adding or modifying a controller, regenerate the tsoa output:

```bash
npm run tsoa:gen
```

This produces:
- `public/swagger.json` -- OpenAPI 3.0 spec (served at `/docs`)
- `src/generated/routes.ts` -- Express route wiring

Both files are auto-generated and should not be edited by hand. The `dev` and `build` scripts run this automatically.

### Project structure

```
src/
  controllers/    -- tsoa controllers (HTTP layer)
  hn/             -- HN service layer (Firebase, Algolia, scraping)
  middleware/     -- auth, rate limiting, error handling, logging
  session/        -- Redis session store + AES-256 encryption
  cache/          -- Redis cache with single-flight locking
  generated/      -- auto-generated tsoa routes (do not edit)
```
