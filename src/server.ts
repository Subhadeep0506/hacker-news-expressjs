import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { pinoHttp } from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { logger, genReqId } from './middleware/logging.js';
import { errorHandler } from './middleware/errors.js';
import { RegisterRoutes } from './generated/routes.js';
import { uiRouter } from './ui/router.js';

export function createApp() {
    const app = express();
    app.disable('x-powered-by');
    app.set('trust proxy', 1);

    const __appDir = dirname(fileURLToPath(import.meta.url));
    app.set('view engine', 'pug');
    app.set('views', join(__appDir, 'views'));
    app.use(express.static(join(__appDir, '..', 'public')));
    app.use(express.static(join(__appDir, 'public')));

    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:"],
                connectSrc: ["'self'"],
            },
        },
    }));
    app.use(cors({ origin: true, credentials: true }));
    app.use(compression({ threshold: 1024 }));
    app.use(express.json({ limit: '32kb' }));
    app.use(express.urlencoded({ extended: false, limit: '32kb' }));
    app.use(cookieParser());

    app.use(pinoHttp({
        logger,
        genReqId: () => genReqId(),
        customLogLevel(_req, res, err) {
            if (err || (res.statusCode >= 500)) return 'error';
            if (res.statusCode >= 400) return 'warn';
            return 'info';
        },
        customSuccessMessage(req, res) {
            return `${req.method} ${req.url} ${res.statusCode}`;
        },
        customErrorMessage(req, res) {
            return `${req.method} ${req.url} ${res.statusCode}`;
        },
        serializers: {
            req(req) {
                return {
                    id: req.id,
                    method: req.method,
                    url: req.url,
                    remoteAddress: req.remoteAddress,
                };
            },
            res(res) {
                return {
                    statusCode: res.statusCode,
                };
            },
        },
    }));

    const swaggerSpec = JSON.parse(
        readFileSync(join(__appDir, '..', 'public', 'swagger.json'), 'utf8'),
    );
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customSiteTitle: 'HN Companion API Docs',
    }));

    app.use(uiRouter);
    RegisterRoutes(app);

    app.use(errorHandler);

    logger.info('express app created');
    return app;
}
