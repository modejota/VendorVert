import { FastifyInstance } from "fastify";
import { APIValidators as APIV } from '../constants/api_validators';
import { Constants as C } from "../constants/constants";
import Bill from "../models/bill";
import Client from "../models/client";
import { logger } from "../utils/logger";

export default async function clientController(fastify: FastifyInstance) {

    fastify.route({
        method: "GET",
        url: "/",
        handler: async function (request, reply) {
            let clients = await Client.find()
            logger.info('All clients retrieved.')
            return reply.code(200).send(clients)
        }
    })

    fastify.route({
        method: "GET",
        url: "/:id",
        schema: {
            params: APIV.ClientID
        },
        handler: async function (request, reply) {
            let data = JSON.parse(JSON.stringify(request.params))
            const search = await Client.findOne({DNI: data.id})
            if (!search) {
                logger.error(`Client with DNI ${data.id} not found.`)
                return reply.code(404).send({error: `Client with DNI ${data.id} not found.`})
            }
            logger.info(`Client with DNI ${data.id} retrieved.`)
            return reply.code(200).send(search)
        }   
    })

    fastify.route({
        method: "POST",
        url: "/",
        schema: {
            body: APIV.ClientData
        },
        handler: async function (request, reply) {
            let data = JSON.parse(JSON.stringify(request.body))

            if (C.EMAIL_REGEX.test(data.email) == false) {
                logger.error(`Invalid email format specified when trying to create a client.`)
                return reply.code(400).send({error: `Invalid email format specified.`})
            } 
            
            let client = await Client.findOne({DNI: data.id})
            if (client) {
                logger.error(`Client with DNI ${data.id} already exists.`)
                return reply.code(409).send({error: `Client with DNI ${data.id} already exists.`})
            }
        
            let new_client = new Client({
                DNI: data.id,
                nombre: data.nombre,
                apellidos: data.apellidos,
                email: data.email,
            })
            await new_client.save()
            logger.info(`Client with DNI ${data.id} inserted into the database successfully.`)
            return reply.code(201).header('Location', `/clients/${data.id}`).send({message: `Client with DNI ${data.id} inserted into the database successfully.`})

        }
    })

    fastify.route({
        method: "DELETE",
        url: "/:id",
        schema: {
            params: APIV.ClientID
        },
        handler: async function (request, reply) {
            let data = JSON.parse(JSON.stringify(request.params))
            let client = await Client.findOne({DNI: data.id})
            if (!client) {
                logger.error(`Client with DNI ${data.id} not found.`)
                return reply.code(404).send({error: `Client with DNI ${data.id} not found.`})
            }
            await Client.deleteOne({DNI: data.id})
            logger.info(`Client with DNI ${data.id} deleted from the database successfully.`)
            return reply.code(200).send({message: `Client with DNI ${data.id} deleted from the database successfully.`})
        }
    })

    fastify.route({
        method: "PUT",
        url: "/:id",
        schema: {
            params: APIV.ClientID,
            body: APIV.ModifyingClientData
        },
        handler: async function (request, reply) {
            let data = JSON.parse(JSON.stringify(request.params))
            let body = JSON.parse(JSON.stringify(request.body))
            if (C.EMAIL_REGEX.test(body.email) == false) {
                logger.error(`Invalid email format specified when trying to create a client.`)
                return reply.code(400).send({error: `Invalid email format specified.`})
            } 

            let search = await Client.findOne({DNI: data.id})
            if (!search) {
                let client = new Client({
                    DNI: data.id,
                    nombre: body.nombre,
                    apellidos: body.apellidos,
                    email: body.email,
                })
                await client.save()
                logger.info(`Client with DNI ${data.id} inserted into the database successfully.`)
                return reply.code(201).header('Location', `/clients/${data.id}`).send({message: `Client with DNI ${data.id} inserted into the database successfully.`})
            }
            await Client.updateOne({DNI: data.id}, {
                nombre: body.nombre,
                apellidos: body.apellidos,
                email: body.email,
            })
            logger.info(`Client with DNI ${data.id} updated successfully.`)
            return reply.code(200).send({message: `Client with DNI ${data.id} updated successfully.`})
        }
    })

    fastify.route({
        method: "GET",
        url: "/:id/invoices",
        schema: {
            params: APIV.ClientID
        },
        handler: async function (request, reply) {
            let data = JSON.parse(JSON.stringify(request.params))
            let client = await Client.findOne({DNI: data.id})
            if (!client) {
                logger.error(`Client with DNI ${data.id} not found.`)
                return reply.code(404).send({error: `Client with DNI ${data.id} not found.`})
            }
            let facturas = await Bill.find({clienteDNI: client.DNI})
            logger.info(`All invoices from client with DNI ${data.id} retrieved.`)
            return reply.code(200).send(facturas)
        }
    })

}
