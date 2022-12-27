import { FastifyInstance } from "fastify";
import storageController from "./controllers/storage_controller";
import billController from "./controllers/bill_controller";
import clientController from "./controllers/client_controller";

export default async function router (fastify: FastifyInstance) {
    
    // Register controllers
    fastify.register(storageController, { prefix: "/products" })
    fastify.register(billController, { prefix: "/invoices" })
    fastify.register(clientController, { prefix: "/clients" })

    // Default route, just a greeting
    fastify.get("/", async function (request, reply) {
        reply.status(200).send({ greeting: 'Welcome to VendorVert API' });
    })
    
    // Status route, just saying that the API is live
    fastify.get('/status', async function (request, reply) {
        reply.status(200).send({ hello: 'I am live!' });
    })

}