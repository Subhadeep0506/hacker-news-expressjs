import { Controller, Get, Route, Tags, Response, SuccessResponse } from 'tsoa';
import { redis } from '../cache/redis.js';
import { logger } from '../middleware/logging.js';
import type { HealthResponse } from './types.js';

@Route('health')
@Tags('Health')
export class HealthController extends Controller {

    /** Pings Redis to verify the server is operational */
    @Get()
    @SuccessResponse(200, 'Healthy')
    @Response<HealthResponse>(503, 'Redis unreachable')
    public async healthCheck(): Promise<HealthResponse> {
        try {
            await redis.ping();
            logger.debug('health check passed');
            return { ok: true };
        } catch (err) {
            logger.error({ err }, 'health check failed — redis unreachable');
            this.setStatus(503);
            return { ok: false, error: 'redis_down' };
        }
    }
}
