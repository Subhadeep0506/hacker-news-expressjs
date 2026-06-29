import https from 'node:https';

export const hnAgent = new https.Agent({
    keepAlive: true,
    keepAliveMsecs: 30_000,
    maxSockets: 100,
    maxFreeSockets: 20,
    scheduling: 'lifo',
});