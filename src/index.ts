import { configuration as cfg } from './config';
import mongoose from 'mongoose'
import {logger} from './utils/logger'
import app from './app'

const start = async () => 
    app.listen( {port: cfg.fastify_port}, (err, address) => {
        if (err) {
            console.error(err);
            logger.error(err);
            process.exit(1);
        }
        console.log(`Server listening at ${address}`);
        logger.info(`Server listening at ${address}`);
        // Tiene que estar lanzada la base de datos de mongodb del docker-compose. Como está fuera del clúster usa localhost
        mongoose.connect('mongodb://localhost:27017/vendorvert')
        .then(() => {
            logger.info('MongoDB connected...') 
            console.log('MongoDB connected...') })
        .catch(err => {
            logger.error(err)
            console.log(err)
        });
        mongoose.set('strictQuery', false);
});
start()



