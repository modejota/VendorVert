import { FastifyInstance } from "fastify";
import { APIValidators as APIV } from "../constants/api_validators";
import { ProductType } from "../models/product_type";
import { logger } from "../utils/logger";
import Product from "../models/product";

export default async function storageController (fastify: FastifyInstance) {

    fastify.route({
        method: "GET",
        url: "/",
        handler: async function (request, reply) {
            const products = await Product.find()
            logger.info('All products from storage retrieved')
            return reply.code(200).send(products)
        }
    })

    fastify.route({
        method: "GET",
        url: "/:id",
        schema: {
            params: APIV.ProductID
        },
        handler: async function (request, reply) {
            let data = JSON.parse(JSON.stringify(request.params))
            const producto = await Product.findOne({barcode  : data.id})
            if (!producto) {
                logger.info(`Product with barcode ${data.id} not found`)
                return reply.code(404).send({message: `Product with barcode ${data.id} not found`})
            }
            logger.info(`Product with barcode ${data.id} retrieved`)
            return reply.code(200).send(producto)
        }
    })

    fastify.route({
        method: "POST",
        url: "/",
        schema: {
            body: APIV.ProductData
        },
        handler: async function (request, reply) {
            let data = JSON.parse(JSON.stringify(request.body))
            data.tipo = data.tipo > ProductType.INDEFINIDO ? ProductType.INDEFINIDO : data.tipo;
            data.cantidad = data.cantidad ? data.cantidad : 0;

            const producto = await Product.findOne({barcode: data.id})
            if (producto) {
                logger.info(`Product with barcode ${data.id} already exists`)
                return reply.code(409).send({message: `Product with barcode ${data.id} already exists`})
            }
            let product = new Product({
                barcode: data.id,
                nombre: data.nombre,
                marca: data.marca,
                tipo: data.tipo,
                PVP: data.PVP,
                cantidad: data.cantidad
            })
            await product.save()
            logger.info(`Product with barcode ${data.id} inserted into the storage successfully`)
            return reply.header('Location', `/products/${data.id}`).code(201).send({message: `Product with barcode ${data.id} inserted into the storage successfully`})
        }
    })

    fastify.route({
        method: "DELETE",
        url: "/:id",
        schema: {
            params: APIV.ProductID
        },
        handler: async function (request, reply) {
            let data = JSON.parse(JSON.stringify(request.params))
            
            const search = await Product.findOne({barcode: data.id})
            if (!search) {
                logger.info(`Product with barcode ${data.id} not found`)
                return reply.code(404).send({message: `Product with barcode ${data.id} not found`})
            }
            await Product.findOneAndDelete({barcode : data.id})
            logger.info(`Product with barcode ${data.id} deleted successfully`)
            return reply.code(200).send({message: 'Product deleted successfully'})
        }
    })

    fastify.route({
        method: "PUT",
        url: "/:id",
        schema: {
            params: APIV.ProductID,
            body: APIV.ModifyingProductData
        },
        handler: async function (request, reply) {
            let ID = JSON.parse(JSON.stringify(request.params)).id
            let data = JSON.parse(JSON.stringify(request.body))
            data.tipo = data.tipo > ProductType.INDEFINIDO ? ProductType.INDEFINIDO : data.tipo;
            data.cantidad = data.cantidad ? data.cantidad : 0;
            
            const search = await Product.findOne({barcode: ID})
            if (!search) {
                let product = new Product({
                    barcode: ID,
                    nombre: data.nombre,
                    marca: data.marca,
                    tipo: data.tipo,
                    PVP: data.PVP,
                    cantidad: data.cantidad
                })
                await product.save()
                logger.info(`Product with barcode ${ID} inserted into the storage successfully`)
                return reply.header('Location', `/products/${ID}`).code(201).send({message: `Product with barcode ${ID} inserted into the storage successfully`})
            } else {
                await Product.findOneAndUpdate({barcode: ID}, {
                    nombre: data.nombre,
                    marca: data.marca,
                    tipo: data.tipo,
                    PVP: data.PVP
                })
                logger.info(`Product with barcode ${ID} updated successfully`)
                return reply.code(200).send({message: `Product with barcode ${ID} updated successfully`})
            } 
        }
    })

    fastify.route({
        method: "PATCH",
        url: "/:id",
        schema: {
            params: APIV.ProductID,
            body: APIV.QuantityOfAProductData
        }, 
        handler: async function (request, reply) {
            let ID = JSON.parse(JSON.stringify(request.params)).id
            let new_quantity = JSON.parse(JSON.stringify(request.body)).cantidad

            const search = await Product.findOne({barcode: ID})
            if (!search) {
                logger.info(`Product with barcode ${ID} not found`)
                return reply.code(404).send({message: `Product with barcode ${ID} not found`})
            }
            
            await Product.findOneAndUpdate({barcode: ID}, {
                cantidad: new_quantity
            })
            logger.info(`Product with barcode ${ID} updated successfully`)
            return reply.code(200).send({message: `Product with barcode ${ID} updated successfully`})
        }
    })

}