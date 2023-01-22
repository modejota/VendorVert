import { FastifyInstance } from "fastify";
import { APIValidators as APIV } from "../constants/api_validators";
import Product from "../models/product";
import Client from "../models/client";
import Bill from "../models/bill";
import { logger } from "../utils/logger";

export default async function billController (fastify: FastifyInstance) {
    
        fastify.route({
            method: "GET",
            url: "/",
            handler: async function (request, reply) {
                const bills = await Bill.find()
                return reply.code(200).send(bills)
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
                const bill = await Bill.findOne({numFactura : data.id})
                if (!bill) {
                    logger.error(`Bill with id ${data.id} not found`)
                    return reply.code(404).send({message: `Bill with id ${data.id} not found`})
                }
                logger.info(`Bill with id ${data.id} retrieved`)
                return reply.code(200).send(bill)
            }
        })

        fastify.route({
            method: "GET",
            url: "/:id/products",
            schema: {
                params: APIV.BillID
            },
            handler: async function (request, reply) {
                let data = JSON.parse(JSON.stringify(request.params))
                const bill = await Bill.findOne({numFactura : data.id})
                if (!bill) {
                    logger.error(`Bill with id ${data.id} not found`)
                    return reply.code(404).send({message: 'Bill with id ${data.id} not found'})
                }
            
                let products_detailed = []
                for (let i = 0; i < bill.productos.length; i++) {
                    const product = await Product.findOne({barcode: bill.productos[i].barcode}, {barcode: 1, nombre: 1, marca: 1, PVP: 1})
                    if (!product) {
                        logger.error(`Product with barcode ${bill.productos[i].barcode} not found while retrieving bill with id ${data.id}`)
                        return reply.code(404).send({message: 'Product with barcode ${bill.productos[i].barcode} not found while retrieving bill with id ${data.id}'})
                    }
                    product.cantidad = bill.productos[i].cantidad
                    products_detailed.push(product)
                }
                logger.info(`Products of bill with id ${data.id} retrieved`)
                return reply.code(200).send(products_detailed)
            }
        })

        fastify.route({
            method: "GET",
            url: "/:id/products/:idp",
            schema: {
                params: APIV.ProductOfABillID
            },
            handler: async function (request, reply) {
                let data = JSON.parse(JSON.stringify(request.params))
                const bill = await Bill.findOne({numFactura : data.id})
                if (!bill) {
                    logger.error(`Bill with id ${data.id} not found`)
                    return reply.code(404).send({message: 'Bill not found'})
                }
                let product_detailed = {}
                for (let i = 0; i < bill.productos.length; i++) {
                    if (bill.productos[i].barcode == data.idp) {
                        const product = await Product.findOne({barcode: bill.productos[i].barcode}, {barcode: 1, nombre: 1, marca: 1, PVP: 1})
                        if (!product) {
                            logger.error(`Product with barcode ${bill.productos[i].barcode} not found in the storage while retrieving bill with id ${data.id}`)
                            return reply.code(404).send({message: `Product with barcode ${bill.productos[i].barcode} not found in the storage while retrieving bill with id ${data.id}`})
                        }
                        product.cantidad = bill.productos[i].cantidad
                        product_detailed = product
                        break
                    }
                }
                if (Object.keys(product_detailed).length !== 0) {
                    logger.info(`Product with barcode ${data.idp} retrieved from bill with id ${data.id}`)
                    return reply.code(200).send(product_detailed)
                } else {
                    logger.error(`Product with barcode ${data.idp} not found in bill with id ${data.id}`)
                    return reply.code(404).send({message: `Product with barcode ${data.idp} not found in bill with id ${data.id}`})
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
                let data = JSON.parse(JSON.stringify(request.params))
                const bill = await Bill.findOne({numFactura : data.id})
                if (!bill) {
                    logger.error(`Bill with id ${data.id} not found`)
                    return reply.code(404).send({message: `Bill with id ${data.id} not found`})
                }
                const client = await Client.findOne({DNI: bill.clienteDNI}, {DNI: 1, nombre: 1, apellidos: 1, email: 1})
                if (!client) {
                    logger.error(`Client with DNI ${bill.clienteDNI} not found while retrieving bill with id ${data.id}`)
                    return reply.code(404).send({message: 'Client not found'})
                }
                logger.info(`Client of bill with id ${data.id} retrieved`)
                return reply.code(200).send(client)
            }
        })

        fastify.route({
            method: "GET",
            url: "/:id/total",
            schema: {
                params: APIV.BillID
            },
            handler: async function (request, reply) {
                let data = JSON.parse(JSON.stringify(request.params))
                const bill = await Bill.findOne({numFactura: data.id})
                if (!bill) {
                    logger.error(`Bill with id ${data.id} not found`)
                    return reply.code(404).send({message: `Bill with id ${data.id} not found`})
                }
                let total = 0
                for (let i = 0; i < bill.productos.length; i++) {
                    const product = await Product.findOne({barcode: bill.productos[i].barcode}, {PVP: 1})
                    if (!product) {
                        logger.error(`Product with barcode ${bill.productos[i].barcode} not found while calculating total for bill with id ${data.id}`)
                        return reply.code(404).send({message: `Product with barcode ${bill.productos[i].barcode} not found while calculating total for bill with id ${data.id}`})
                    }
                    total += product.PVP * bill.productos[i].cantidad
                }
                let totalM = total.toFixed(2) + " €"
                logger.info(`Total of bill with id ${data.id} retrieved`)
                return reply.code(200).send(totalM)
            }
        })
                
        fastify.route({
            method: "POST",
            url: "/",
            schema: {
                body: APIV.BillIDwithClient
            },
            handler: async function (request, reply) {
                let data = JSON.parse(JSON.stringify(request.body))

                const searchClientExists = await Client.findOne({DNI: data.idc})
                if (!searchClientExists) {
                    logger.error(`Client with DNI ${data.idc} not found. Invoice not created`)
                    return reply.code(404).send({message: `Client with DNI ${data.idc} not found. Invoice not created`}) 
                }

                const searchBillExists = await Bill.findOne({numFactura: data.id})
                if (searchBillExists) {
                    logger.error(`Bill with id ${data.id} already exists`)
                    return reply.code(409).send({message: 'Bill already exists'})
                }
                
                let bill = new Bill({
                    numFactura: data.id,
                    clienteDNI: data.idc,
                })
                await bill.save()
                logger.info(`Bill with id ${data.id} created`)
                return reply.header('Location', `/invoices/${data.id}`).code(201).send({message: 'Bill inserted into the system successfully'})
            }
        })

        fastify.route({
            method: "POST",
            url: "/:id",
            schema: {
                params: APIV.BillID,
                body: APIV.ProductDataBill
            },
            handler: async function (request, reply) {
                let data = JSON.parse(JSON.stringify(request.params))
                let body = JSON.parse(JSON.stringify(request.body))
                const searchBillExists = await Bill.findOne({numFactura: data.id})
                if (!searchBillExists) {
                    logger.error(`Bill with id ${data.id} not found. Product not added`)
                    return reply.code(404).send({message: `Bill with id ${data.id} not found. Product not added`})
                }
                
                const searchProductExists = await Product.findOne({barcode: body.barcode})
                if (!searchProductExists) {
                    logger.error(`Product with barcode ${body.barcode} not found. Product not added`)
                    return reply.code(404).send({message: 'Product not found in the storage. Product not added'})
                }
                
                if (searchBillExists.productos.length > 0) {
                    for (let i = 0; i < searchBillExists.productos.length; i++) {
                        if (searchBillExists.productos[i].barcode == body.barcode) {
                            logger.error(`Product with barcode ${body.barcode} already added to the bill`)
                            return reply.code(409).send({message: `Product with barcode ${body.barcode} already added to the bill. Use PATCH method to modify its quantity`})
                        }
                    }
                }

                await Bill.findOneAndUpdate({numFactura: data.id}, {$push: {productos: {barcode: body.barcode, cantidad: body.cantidad}}})
                logger.info(`Product with barcode ${body.barcode} added to the bill with id ${data.id}`)
                return reply.code(201).header('Location', `/invoices/${data.id}/products/${body.barcode}`).send({message: 'Product added to the bill successfully'})
            }

        })

        fastify.route({
            method: "PATCH",
            url: "/:id/products/:idp",
            schema: {
                params: APIV.ProductOfABillID,
                body: APIV.QuantityOfAProductData
            },
            handler: async function (request, reply) {
                let data = JSON.parse(JSON.stringify(request.params))
                let body = JSON.parse(JSON.stringify(request.body))
                const searchBillExists = await Bill.findOne({numFactura: data.id})
                if (!searchBillExists) {
                    logger.error(`Bill with id ${data.id} not found. Product quantity not modified`)
                    return reply.code(404).send({message: `Bill with id ${data.id} not found. Product quantity not modified`})
                }
                if (searchBillExists.productos.length > 0) {
                        for (let i = 0; i < searchBillExists.productos.length; i++) {
                            if (searchBillExists.productos[i].barcode == data.idp) {
                                let products = searchBillExists.productos
                                products[i].cantidad = body.cantidad
                                await Bill.findOneAndUpdate({numFactura: data.id}, {$set: {productos: products}})
                                logger.info(`Product with barcode ${data.idp} quantity modified in the bill with id ${data.id}`)
                                return reply.code(200).send({message: 'Product quantity from the bill updated successfully'})
                            }
                        }
                    }
                logger.error(`Product with barcode ${data.idp} not found in the bill. Product quantity not modified`)
                return reply.code(404).send({message: 'Product not found in the bill. Product quantity not modified'})
            }
        })

        fastify.route({
            method: "PATCH",
            url: "/:id/client",
            schema: {
                params: APIV.BillID,
                body: APIV.ClientID
            },
            handler: async function (request, reply) {
                let data = JSON.parse(JSON.stringify(request.params))
                let body = JSON.parse(JSON.stringify(request.body))
                const searchBillExists = await Bill.findOne({numFactura: data.id})
                if (!searchBillExists) {
                    logger.error(`Bill with id ${data.id} not found. Client not modified`)
                    return reply.code(404).send({message: `Bill with id ${data.id} not found. Client not modified`})
                }
                const searchClientExists = await Client.findOne({DNI: body.id})
                if (!searchClientExists) {
                    logger.error(`Client with id ${body.id} not found. Client not modified in the invoice`)
                    return reply.code(404).send({message: `Client with id ${body.id} not found. Client not modified in the invoice`})
                }
                
                await Bill.findOneAndUpdate({numFactura: data.id}, {$set: {clienteDNI: body.id}})
                logger.info(`Client with id ${body.id} modified in the bill with id ${data.id}`)
                return reply.code(200).send({message: 'Client from the bill updated successfully'})
            }
        })

        fastify.route({
            method: "DELETE",
            url: "/:id",
            schema: {
                params: APIV.BillID
            },
            handler: async function (request, reply) {
                let data = JSON.parse(JSON.stringify(request.params))
                const searchBillExists = await Bill.findOne({numFactura: data.id})
                if (!searchBillExists) {
                    logger.error(`Bill with id ${data.id} not found. Bill not deleted`)
                    return reply.code(404).send({message: `Bill with id ${data.id} not found. Bill not deleted`})	
                }
                await Bill.deleteOne({numFactura: data.id})
                logger.info(`Bill with id ${data.id} deleted successfully`)
                return reply.code(200).send({message: 'Bill deleted successfully'})
            }
        })

        fastify.route({
            method: "DELETE",
            url: "/:id/products/:idp",
            schema: {
                params: APIV.ProductOfABillID
            },
            handler: async function (request, reply) {
                let data = JSON.parse(JSON.stringify(request.params))
                const searchBillExists = await Bill.findOne({numFactura: data.id})
                if (!searchBillExists) {
                    logger.error(`Bill with id ${data.id} not found. Product not deleted`)
                    return reply.code(404).send({message: `Bill with id ${data.id} not found. Product not deleted`})
                }

                if (searchBillExists.productos.length > 0) {
                    for (let i = 0; i < searchBillExists.productos.length; i++) {
                        if (searchBillExists.productos[i].barcode == data.idp) {
                            await Bill.findOneAndUpdate({numFactura: data.id}, {$pull: {productos: {barcode: data.idp}}})
                            logger.info(`Product with barcode ${data.idp} deleted from the bill with id ${data.id}`)
                            return reply.code(200).send({message: `Product with barcode ${data.idp} deleted from the bill with id ${data.id}`})
                        }
                    }
                }
                logger.error(`Product with barcode ${data.idp} not found in the bill. Product not deleted`)
                return reply.code(404).send({message: `Product with barcode ${data.idp} not found in the bill. Product not deleted`})

            }
        })
}
