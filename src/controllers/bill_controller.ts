import { FastifyInstance } from 'fastify';
import { handler } from '../handler';
import { APIValidators as APIV } from '../constants/api_validators';
import { ProductType } from '../models/product_type';
import { parseFacturas, parseProductos } from '../utils/parsers';
import { HandlerError } from '../errors/handler_error';
import { logger } from '../utils/logger';

export default async function billController(fastify: FastifyInstance) {

    fastify.route({
        method: "GET",
        url: "/",
        handler: async function (request, reply) {
            const result = parseFacturas(handler.get_all_facturas())
            reply.status(200).send({invoices: result})
        }
    })

    fastify.route({
        method: "GET",
        url: "/:id",
        schema: {
            params: APIV.BillID
        },
        handler: async function (request, reply) {
            let data = JSON.parse(JSON.stringify(request.params))
            try {
                let bill = handler.obtener_factura(data.id)
                reply.code(200).send(bill)
            } catch {
                logger.error(`Invoice with ID ${data.id} not found.`)
                reply.code(404).send({error: `Invoice with ID ${data.id} not found.`})
            }
        }
    })

    fastify.route({
        method: "GET",
        url: "/:id/products",
        schema: {
            params: APIV.BillID
        },
        handler: async function (request, reply) {
            let ID = JSON.parse(JSON.stringify(request.params)).id
            try {
                let factura = handler.obtener_factura(ID)
                let productos = parseProductos(factura.productos)
                reply.code(200).send({products: productos})
            } catch {
                logger.error(`Invoice with ID ${ID} not found so no products can be retreived.`)
                reply.code(404).send({error: `Invoice with ID ${ID} not found.`})
            }
        }
    })

    fastify.route({
        method: "GET",
        url: "/:id/products/:idp",
        schema: {
            params: APIV.ProductOfABillID
        },
        handler: async function (request, reply) {
            let params = JSON.parse(JSON.stringify(request.params))
            try {
                handler.obtener_factura(params.id)
            } catch {
                logger.error(`Invoice with ID ${params.id} not found.`)
                reply.code(404).send({error: `Invoice with ID ${params.id} not found.`})
            }
            try {
                let product = handler.obtener_producto_factura(params.id, params.idp)
                reply.code(200).send({product: product})
            } catch {
                logger.error(`Product with ID ${params.idp} not found in invoice with ID ${params.id}.`)
                reply.code(404).send({error: `Product with ID ${params.idp} not found in invoice with ID ${params.id}.`})
            }
        }
    })

    fastify.route({
        method: "GET",
        url: "/:id/client",
        schema: {
            params: APIV.BillID
        },
        handler: async function (request, reply) {
            let ID = JSON.parse(JSON.stringify(request.params)).id
            try {
                let factura = handler.obtener_factura(ID)
                let client = factura.client
                reply.code(200).send({client: client})
            } catch {
                logger.error(`Invoice with ID ${ID} not found so no client can be retreived.`)
                reply.code(404).send({error: `Invoice with ID ${ID} not found.`})
            }
        }
    })

    fastify.route({
        method: "GET",
        url: "/:id/total",
        schema: {
            params: APIV.BillID
        },
        handler: async function (request, reply) {
            let ID = JSON.parse(JSON.stringify(request.params)).id
            try {
                reply.code(200).send({total: handler.calcular_total_factura(ID)})
            } catch {
                logger.error(`Invoice with ID ${ID} not found so no total can be retreived.`)
                reply.code(404).send({error: `Invoice with ID ${ID} not found.`})
            }
        }
    })

    fastify.route({
        method: 'POST',
        url: '/',
        schema: {
            body: APIV.BillIDwithClient
        },
        handler: async function (request, reply) {
            let data = JSON.parse(JSON.stringify(request.body))
            try {
                handler.existe_factura(data.id) 
                try {
                    handler.obtener_cliente(data.idc)
                } catch {
                    logger.error(`Client with ID ${data.idc} not found.`)
                    reply.status(404).send({error: `Client with ID ${data.idc} not found.`})
                }
                handler.crear_factura(data.id, data.idc)
                reply.header("Location", `/invoices/${data.id}`)
                logger.info(`Invoice with ID ${data.id} created successfully.`)
                reply.status(201).send({result: `Invoice with ID ${data.id} created successfully.`})
            } catch {
                logger.error(`Invoice with ID ${data.id} already exists so it can't be created.`)
                reply.status(409).send({error: `Invoice with ID ${data.id} already exists.`})
            }
        }
    })

    fastify.route({
        method: 'POST',
        url: '/:id',
        schema: {
            params: APIV.BillID,
            body: APIV.ProductData
        },
        handler: async function (request, reply) {
            let ID = JSON.parse(JSON.stringify(request.params)).id
            let data = JSON.parse(JSON.stringify(request.body))
            data.tipo = data.tipo > ProductType.INDEFINIDO ? ProductType.INDEFINIDO : data.tipo;

            try {
                handler.existe_factura(ID)
            } catch {
                logger.error(`Invoice with ID ${ID} not found so no product can be added to that.`)
                reply.status(404).send({error: `Invoice with ID ${ID} not found.`})
            }
            try {
                let product = handler.crear_producto(data.id, data.nombre, data.marca, data.tipo, data.PVP)
                handler.aniadir_producto_factura(ID, product, data.cantidad)
                reply.header("Location", `/invoices/${ID}/products/${data.id}`)
                logger.info(`Product with ID ${data.id} added to invoice with ID ${ID} successfully.`)
                reply.status(201).send({result: `Product with ID ${data.id} added to invoice with ID ${ID} successfully.`})
            } catch {
                logger.error(`Product with ID ${data.id} already exists in invoice with ID ${ID}.`)
                reply.status(409).send({error: `Product with ID ${data.id} already exists in invoice with ID ${ID}.`})
            }
        }
    })

    fastify.route({
        method: 'PUT',
        url: '/:id/products/:idp',
        schema: {
            params: APIV.ProductOfABillID,
            body: APIV.ModifyingProductData
        },
        handler: async function (request, reply) {
            let params = JSON.parse(JSON.stringify(request.params))
            let data = JSON.parse(JSON.stringify(request.body))
            data.tipo = data.tipo > ProductType.INDEFINIDO ? ProductType.INDEFINIDO : data.tipo;
            try {
                handler.obtener_factura(params.id)
            } catch {
                logger.error(`Invoice with ID ${params.id} not found so no product can be updated in that.`)
                reply.status(404).send({error: `Invoice with ID ${params.id} not found.`})
            }
            try {
                let product = handler.crear_producto(params.idp, data.nombre, data.marca, data.tipo, data.PVP)
                handler.actualizar_producto_factura(params.id, product, data.cantidad)
                logger.info(`Product with ID ${params.idp} updated in invoice with ID ${params.id} successfully.`)
                reply.status(200).send({result: `Product with ID ${params.idp} updated in invoice with ID ${params.id} successfully.`})
            } catch {
                logger.error(`Product with ID ${params.idp} not found in invoice with ID ${params.id}.`)
                reply.status(404).send({error: `Product with ID ${params.idp} not found in invoice with ID ${params.id}.`})
            }
        }
    })

    fastify.route({
        method: 'PATCH',
        url: '/:id/client',
        schema: {
            params: APIV.BillID,
            body: APIV.ClientID
        },
        handler: async function (request, reply) {
            let params = JSON.parse(JSON.stringify(request.params))
            let data = JSON.parse(JSON.stringify(request.body))
            try {
                handler.obtener_factura(params.id)
            } catch {
                logger.error(`Invoice with ID ${params.id} not found so no client can be updated in that.`)
                reply.status(404).send({error: `Invoice with ID ${params.id} not found.`})
            }
            try {
                let client = handler.obtener_cliente(data.id)
                handler.modificar_cliente_factura(params.id, client)
                logger.info(`Client in invoice with ID ${params.id} updated successfully to ID ${data.id}.`)
                reply.status(200).send({result: `Client in invoice with ID ${params.id} updated successfully to ID ${data.id}.`})
            } catch {
                logger.error(`Client with ID ${data.id} not found.`)
                reply.status(404).send({error: `Client with ID ${data.id} not found.`})
            }
        }
    })

    fastify.route({
        method: 'PATCH',
        url: '/:id/products/:idp',
        schema: {
            params: APIV.ProductOfABillID,
            body: APIV.QuantityOfAProductData
        },
        handler: async function (request, reply) {
            let params = JSON.parse(JSON.stringify(request.params))
            let data = JSON.parse(JSON.stringify(request.body))
            try {
                handler.obtener_factura(params.id)
            } catch {
                logger.error(`Invoice with ID ${params.id} not found so no product's quantity can be updated in that.`)
                reply.status(404).send({error: `Invoice with ID ${params.id} not found.`})
            }
            try {
                handler.actualizar_cantidad_producto_factura(params.id, params.idp, data.cantidad)
                logger.info(`Quantity of product with ID ${params.idp} updated in invoice with ID ${params.id} successfully.`)
                reply.status(200).send({result: `Quantity of product with ID ${params.idp} updated in invoice with ID ${params.id} successfully.`})
            } catch {
                logger.error(`Product with ID ${params.idp} not found in invoice with ID ${params.id}.`)
                reply.status(404).send({error: `Product with ID ${params.idp} not found in invoice with ID ${params.id}.`})
            }
        }
    })

    fastify.route({
        method: 'DELETE',
        url: '/:id',
        schema: {
            params: APIV.BillID
        },
        handler: async function (request, reply) {
            let ID = JSON.parse(JSON.stringify(request.params)).id
            try {
                handler.eliminar_factura(ID)
                logger.info(`Invoice with ID ${ID} deleted successfully.`)
                reply.status(200).send({result: `Invoice with ID ${ID} deleted successfully.`})
            } catch {
                logger.error(`Invoice with ID ${ID} not found.`)
                reply.status(404).send({error: `Invoice with ID ${ID} not found.`})
            }
        }
    })

    fastify.route({
        method: 'DELETE',
        url: '/:id/products/:idp',
        schema: {
            params: APIV.ProductOfABillID
        },
        handler: async function (request, reply) {
            let params = JSON.parse(JSON.stringify(request.params))
            try {
                handler.obtener_factura(params.id)
            } catch {
                logger.error(`Invoice with ID ${params.id} not found so no product can be deleted from that.`)
                reply.status(404).send({error: `Invoice with ID ${params.id} not found.`})
            }
            try {
                handler.eliminar_producto_factura(params.id, params.idp)
                logger.info(`Product with ID ${params.idp} deleted from invoice with ID ${params.id} successfully.`)
                reply.status(200).send({result: `Product with ID ${params.idp} deleted from invoice with ID ${params.id} successfully.`})
            } catch {
                logger.error(`Product with ID ${params.idp} not found in invoice with ID ${params.id}.`)
                reply.status(404).send({error: `Product with ID ${params.idp} not found in invoice with ID ${params.id}.`})
            }
        }
    })

}