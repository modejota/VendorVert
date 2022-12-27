import { FastifyInstance } from "fastify";
import { handler } from '../handler';
import { APIValidators as APIV } from '../constants/api_validators';
import { Client } from "../models/client";
import { parseClientes } from "../utils/parsers";

export default async function clientController(fastify: FastifyInstance) {

    fastify.route({
        method: "GET",
        url: "/",
        handler: async function (request, reply) {
            let clients = parseClientes(handler.get_all_clientes())
            reply.status(200).send({clientes: clients})
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
            try {
                let client = handler.obtener_cliente(data.id)
                reply.code(200).send({cliente: client})
            } catch {
                reply.code(404).send({error: `Client with ID ${data.id} not found.`})
            }
        }
    })

    fastify.route({
        method: "GET",
        url: "/:id/invoices",
        schema: {
            params: APIV.ClientID
        },
        handler: async function (request, reply) {
            let ID = JSON.parse(JSON.stringify(request.params)).id
            try {
                let client = handler.obtener_cliente(ID)
                let facturas = handler.get_all_facturas()
                let bills = []
                for (let factura of facturas) {
                    if (factura[1].client.id == ID) {
                        bills.push(factura)
                    }
                }
                reply.code(200).send({facturas: bills})
            } catch {
                reply.code(404).send({error: `Client with ID ${ID} not found.`})
            }
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
            try {
                let client = new Client(data.id, data.nombre, data.apellidos, data.email)
                try {
                    handler.aniadir_cliente(client)
                    reply.code(201).send({result: `Client with ID ${data.id} created successfully.`})
                } catch {
                    reply.code(409).send({error: `Client with ID ${data.id} already exists.`})
                }
            } catch {
                reply.code(400).send({error: `Client with ID ${data.id} is not specified correctly.`})

            }
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
            let params = JSON.parse(JSON.stringify(request.params))
            let data = JSON.parse(JSON.stringify(request.body))
            try {
                let client = handler.obtener_cliente(params.id)
                try {
                    handler.eliminar_cliente(params.id)
                    handler.aniadir_cliente(new Client(params.id, data.nombre, data.apellidos, data.email))
                    reply.code(200).send({result: `Client with ID ${params.id} updated successfully.`})
                } catch {
                    reply.code(400).send({error: `Client with ID ${params.id} is not specified correctly.`})
                }
            } catch {
                reply.code(404).send({error: `Client with ID ${params.id} not found.`})
            }
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
            try {
                handler.eliminar_cliente(data.id)
                reply.code(200).send({result: `Client with ID ${data.id} deleted successfully.`})
            } catch {
                reply.code(404).send({error: `Client with ID ${data.id} not found.`})
            }
        }
    })

}