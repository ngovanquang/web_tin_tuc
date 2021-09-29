import { configure, getLogger, Logger } from 'log4js';
import config from 'config';

configure(config.get("log4js"));
const logger: Logger = getLogger('default');

export default logger;