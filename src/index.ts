import { configuration as cfg } from './config';
import mongoose from 'mongoose'
import {logger} from './utils/logger'
import app from './app'

const start = async () => 
    app.listen( {port: cfg.fastify_port, host: '0.0.0.0'}, (err, address) => {
        if (err) {
            console.error(err);
            logger.error(err);
            process.exit(1);
        }
        console.log(`Server listening at ${address}`);
        logger.info(`Server listening at ${address}`);
        mongoose.connect('mongodb://mongodb:27017/vendorvert')
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



