import fastify from "fastify";
import router from "./router";

const server = fastify();
server.register(router);
export default server;