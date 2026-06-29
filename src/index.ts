import 'dotenv/config';
import cluster from 'node:cluster';
import os from 'node:os';
import { config } from './config.js';
import { createApp } from './server.js';
import { logger } from './middleware/logging.js';

const WORKERS = Number(config.WORKERS) || os.availableParallelism();

if (cluster.isPrimary && WORKERS > 1) {
    logger.info({ workers: WORKERS }, 'starting cluster');
    for (let i = 0; i < WORKERS; i++) cluster.fork();
    cluster.on('exit', (worker) => {
        logger.warn({ pid: worker.process.pid }, 'worker died, restarting');
        cluster.fork();
    });
} else {
    const app = createApp();
    const port = Number(config.PORT);
    const server = app.listen(port, () =>
        logger.info({ port, pid: process.pid }, 'ready'),
    );
    server.keepAliveTimeout = 65_000;
    server.headersTimeout = 66_000;

    for (const sig of ['SIGTERM', 'SIGINT'] as const) {
        process.on(sig, () => {
            logger.info({ sig }, 'shutting down');
            server.close(() => process.exit(0));
        });
    }
}
