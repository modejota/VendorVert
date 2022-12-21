import fastify from "fastify";
import router from "./router";

const server = fastify();   // It can have a logger option, but I don't want to use it now
server.register(router);
export default server;