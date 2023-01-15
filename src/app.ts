import router from './router';
import * as fastify from 'fastify';


const app = fastify.default({ logger: false });
app.register(router)
export default app;