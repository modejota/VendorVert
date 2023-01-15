import { FastifyInstance } from "fastify";
import { APIValidators as APIV } from "../constants/api_validators";
import Product from "../models/product";
import Client from "../models/client";
import Bill from "../models/bill";

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
                if (!bill) 
                    return reply.code(404).send({message: 'Bill not found'})
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
                if (!bill)
                    return reply.code(404).send({message: 'Bill not found'})
            
                let products_detailed = []
                for (let i = 0; i < bill.productos.length; i++) {
                    const product = await Product.findOne({barcode: bill.productos[i].barcode}, {barcode: 1, nombre: 1, marca: 1, PVP: 1})
                    if (!product)
                        return reply.code(404).send({message: 'Some of the products can not be found'})
                    product.cantidad = bill.productos[i].cantidad
                    products_detailed.push(product)
                }
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
                if (!bill)
                    return reply.code(404).send({message: 'Bill not found'})

                let product_detailed = {}
                for (let i = 0; i < bill.productos.length; i++) {
                    if (bill.productos[i].barcode == data.idp) {
                        const product = await Product.findOne({barcode: bill.productos[i].barcode}, {barcode: 1, nombre: 1, marca: 1, PVP: 1})
                        if (!product)
                            return reply.code(404).send({message: 'Product not found in the storage'})
                        product.cantidad = bill.productos[i].cantidad
                        product_detailed = product
                        break
                    }
                }
                return reply.code(200).send(product_detailed)
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
                if (!bill)
                    return reply.code(404).send({message: 'Bill not found'})
                const client = await Client.findOne({DNI: bill.clienteDNI}, {DNI: 1, nombre: 1, apellidos: 1, email: 1})
                if (!client)
                    return reply.code(404).send({message: 'Client not found'})
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
                if (!bill)
                    return reply.code(404).send({message: 'Bill not found'})
                let total = 0
                for (let i = 0; i < bill.productos.length; i++) {
                    const product = await Product.findOne({barcode: bill.productos[i].barcode}, {PVP: 1})
                    if (!product)
                        return reply.code(404).send({message: 'Some of the products can not be found'})
                    total += product.PVP * bill.productos[i].cantidad
                }
                let totalM = total.toFixed(2) + " €"
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

                const searchClientExists = await Client.findOne({DNI: data.id_cliente})
                if (!searchClientExists)
                    return reply.code(404).send({message: 'Client not found. Invoice not created'}) 

                const searchBillExists = await Bill.findOne({numFactura: data.id})
                if (searchBillExists)
                    return reply.code(409).send({message: 'Bill already exists'})
                
                let bill = new Bill({
                    numFactura: data.id,
                    clienteDNI: data.id_cliente,
                })
                await bill.save()
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
                if (!searchBillExists)
                    return reply.code(404).send({message: 'Bill not found. Product not added'})
                
                const searchProductExists = await Product.findOne({barcode: body.barcode})
                if (!searchProductExists)
                    return reply.code(404).send({message: 'Product not found in the storage. Product not added'})
                
                if (searchBillExists.productos.length > 0) {
                    for (let i = 0; i < searchBillExists.productos.length; i++) {
                        if (searchBillExists.productos[i].barcode == body.barcode)
                            return reply.code(409).send({message: `Product with barcode ${body.barcode} already added to the bill. Use PATCH method to modify its quantity`})
                    }
                }

                await Bill.findOneAndUpdate({numFactura: data.id}, {$push: {productos: {barcode: body.barcode, cantidad: body.cantidad}}})
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
                if (!searchBillExists)
                    return reply.code(404).send({message: 'Bill not found. Product quantity not modified'})
                
                if (searchBillExists.productos.length > 0) {
                        for (let i = 0; i < searchBillExists.productos.length; i++) {
                            if (searchBillExists.productos[i].barcode == data.idp) {
                                let products = searchBillExists.productos
                                products[i].cantidad = body.cantidad
                                await Bill.findOneAndUpdate({numFactura: data.id}, {$set: {productos: products}})
                                return reply.code(200).send({message: 'Product quantity from the bill updated successfully'})
                            }
                        }
                    }
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
                if (!searchBillExists)
                    return reply.code(404).send({message: 'Bill not found. Client not modified'})
                
                const searchClientExists = await Client.findOne({DNI: body.id})
                if (!searchClientExists)
                    return reply.code(404).send({message: 'Client not found in the system. Client not modified'})
                
                await Bill.findOneAndUpdate({numFactura: data.id}, {$set: {clienteDNI: body.id}})
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
                if (!searchBillExists)
                    return reply.code(404).send({message: 'Bill not found, so it cannot be deleted'})
                await Bill.delete({numFactura: data.id})
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
                if (!searchBillExists)
                    return reply.code(404).send({message: 'Bill not found. Product not deleted'})

                if (searchBillExists.productos.length > 0) {
                    for (let i = 0; i < searchBillExists.productos.length; i++) {
                        if (searchBillExists.productos[i].barcode == data.idp) {
                            await Bill.findOneAndUpdate({numFactura: data.id}, {$pull: {productos: {barcode: data.idp}}})
                            return reply.code(200).send({message: 'Product deleted from the bill successfully'})
                        }
                    }
                }
                return reply.code(404).send({message: 'Product not found in the bill. Product not deleted'})

            }
        })
}
