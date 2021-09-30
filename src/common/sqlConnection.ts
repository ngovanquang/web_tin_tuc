import sql, { ConnectionPool } from 'mssql';
import config from 'config';
import logger from '../middlewares/logger';


// Defaut config
const sqlConfig = {
    user: '',
    password: '',
    database: '',
    server: '',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 5000
    },
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
}

/**
 * Get connection
 * @returns
 */
const getConnection = async (): Promise<ConnectionPool> => {
    const user: string = config.get('sql.user');
    const password: string = config.get('sql.password');
    const database: string = config.get('sql.dbName');
    const server: string = config.get('sql.host');

    sqlConfig.user = user;
    sqlConfig.password = password;
    sqlConfig.database = database;
    sqlConfig.server = server;

    return await sql.connect(sqlConfig);
}

const selectQuery = async (query: string): Promise<any> => {
    try {
        const LOG_TITLE = '[SQL query]:';
        logger.debug(LOG_TITLE, query);
        const conn = await getConnection();
        const result = await conn.query(query);
        return result.recordset;
    } catch (error) {
        logger.error(error);
    }
}

/**
 * Function that help to execute insert, update, delete query
 * @param query query string
 */

 const executeQuery = async (query: string): Promise<any> => {
    try {
        const LOG_TITLE = '[SQL Execute]:';
        logger.debug(LOG_TITLE, query);
        const conn = await getConnection();
        const result = await conn.query(query);
        return result.rowsAffected;
    } catch (error) {
        logger.error(error);
    }
}

export default { selectQuery, executeQuery };