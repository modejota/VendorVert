import app from './app';
import { configuration as cfg} from './config';
import { logger } from './utils/logger';

app.listen( {port: cfg.fastify_port}, (err, address) => {
    if (err) {
        console.error(err);
        logger.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
    logger.info(`Server listening at ${address}`);
});