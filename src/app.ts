import http from 'http';
import express, { Application } from 'express';
import dotenv from 'dotenv';
import routes from './routes/apiv1';
import logger from './middlewares/logger';
import authMiddleware from './middlewares/authMiddleware';

/** Initializing dotenv */
dotenv.config();

/** Initializing express server */
const app: Application = express();

/** This is a built-in middleware function in Express.
 *  It parses incoming requests with urlencoded payloads and is based on body-parser 
 */
app.use(express.urlencoded({ extended: false, limit: '256kb' }));

/** This is a built-in middleware function in Express.
 *  It parses incoming requests with JSON payloads and is based on body-parser
 *  Maximun json string length is support to 256kb
 */
app.use(express.json({ limit: '256kb' }));

/** RULES OF OUR API */
app.use((req: any, res: any, next: any) => {
    // set the CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    // set the CORS headers
    res.header('Access-Control-Allow-Headers', '*');
    // res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    // set the CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET POST PUT DELETE');
        return res.status(200).json({});
    }
    next();
});

app.use(authMiddleware.validUser);

/** Register route with the express */
app.use('/', routes);

/**
 * Global error handling
 */
app.use((err: any, req: any, res: any, next: any) => {
    // Log the error here
    logger.error(err);
    res.status(500).send('Ops, something wrong :((');
});

/** Initializing Server */
const server = http.createServer(app);
/** Get server port setting from env */
const PORT: any = process.env.SERVER_PORT ?? 10000;
server.listen(PORT, () => {
    logger.info(`The server is running on port: ${PORT}`)
});