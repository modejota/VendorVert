import { FastifyInstance } from "fastify";
import { APIValidators as APIV } from '../constants/api_validators';
import { Constants as C } from "../constants/constants";
import Bill from "../models/bill";
import Client from "../models/client";

export default async function clientController(fastify: FastifyInstance) {

    fastify.route({
        method: "GET",
        url: "/",
        handler: async function (request, reply) {
            let clients = await Client.find()
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
            if (!search)
                return reply.code(404).send({error: `Client with DNI ${data.id} not found.`})
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

            if (C.EMAIL_REGEX.test(data.email) == false)
                return reply.code(400).send({error: `Invalid email format.`}) 
            
            let client = await Client.findOne({DNI: data.id})
            if (client) 
                return reply.code(409).send({error: `Client with DNI ${data.id} already exists.`})
        
            let new_client = new Client({
                DNI: data.id,
                nombre: data.nombre,
                apellidos: data.apellidos,
                email: data.email,
            })
            await new_client.save()
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
            if (!client)
                return reply.code(404).send({error: `Client with DNI ${data.id} not found.`})
            await Client.deleteOne({DNI: data.id})
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

            if (C.EMAIL_REGEX.test(body.email) == false)
            return reply.code(400).send({error: `Invalid email format.`}) 

            let search = await Client.findOne({DNI: data.id})
            if (!search) {
                let client = new Client({
                    DNI: data.id,
                    nombre: body.nombre,
                    apellidos: body.apellidos,
                    email: body.email,
                })
                await client.save()
                return reply.code(201).header('Location', `/clients/${data.id}`).send({message: `Client with DNI ${data.id} inserted into the database successfully.`})
            }
            await Client.updateOne({DNI: data.id}, {
                nombre: body.nombre,
                apellidos: body.apellidos,
                email: body.email,
            })
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
            if (!client)
                return reply.code(404).send({error: `Client with DNI ${data.id} not found.`})
            let facturas = await Bill.find({clienteDNI: client.DNI})
            return reply.code(200).send(facturas)
        }
    })

}
