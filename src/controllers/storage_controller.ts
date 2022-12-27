import { FastifyInstance } from "fastify";
import { APIValidators as APIV } from "../constants/api_validators";
import { handler } from "../handler";
import { ProductType } from "../models/product_type";
import { logger } from "../utils/logger";

export default async function storageController (fastify: FastifyInstance) {

    fastify.route({
        method: "GET",
        url: "/",
        handler: async function (request, reply)  {
            const result = Object.fromEntries(handler.get_all_productos_almacen())
            reply.status(200).send(result)
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
            try {
                let product = handler.obtener_producto_almacen(data.id)
                reply.code(200).send(product)
            } catch {
                logger.error(`Product with ID ${data.id} not found.`)
                reply.code(404).send({error: `Product with ID ${data.id} not found.`})
            }
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
            try {
                let product = handler.crear_producto(data.id, data.nombre, data.marca, data.tipo, data.PVP)
                handler.aniadir_producto_almacen(product, data.cantidad)
                reply.header("Location", `/products/${data.id}`)
                logger.info(`Product with ID ${data.id} added successfully to storage.`)
                reply.status(201).send({result: `Product with ID ${data.id} added successfully to storage.`})
            } catch {
                logger.error(`Product with ID ${data.id} already exists so it can'be added to storage.`)
                reply.status(409).send({result: `Product with ID ${data.id} already exists.`})
            }
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
            try {
                let product = handler.crear_producto(ID, data.nombre, data.marca, data.tipo, data.PVP)
                handler.actualizar_producto_almacen(product, data.cantidad)
                logger.info(`Product with ID ${ID} updated successfully.`)
                reply.status(200).send({result: `Product with ID ${ID} updated successfully.`})
            } catch {
                let product = handler.crear_producto(ID, data.nombre, data.marca, data.tipo, data.PVP)
                handler.aniadir_producto_almacen(product, data.cantidad)
                logger.info(`Product with ID ${ID} added successfully to storage as it didn't existed.`)
                reply.header("Location", `/products/${ID}`)
                reply.status(201).send({result: `Product with ID ${ID} added successfully to storage.`})
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
            try {
                handler.actualizar_cantidad_producto_almacen(ID, new_quantity)
                logger.info(`Quantity available of product with ID ${ID} updated successfully.`)
                reply.code(200).send({result: `Quantity available of product with ID ${ID} updated successfully.`})
            } catch {
                logger.error(`Product with ID ${ID} not found in storage so its quantity can't be updated.`)
                reply.code(404).send({error: `Product with ID ${ID} not found.`})
            }
        }
    })

    fastify.route({
        method: "DELETE",
        url: "/:id",
        schema: {
            params: APIV.ProductID
        },
        handler: async function (request, reply) {
            let ID = JSON.parse(JSON.stringify(request.params)).id
            try {
                handler.eliminar_producto_almacen(ID)
                logger.info(`Product with ID ${ID} deleted successfully from storage.`)
                reply.code(200).send({result: `Product with ID ${ID} deleted successfully.`})
            } catch {
                logger.error(`Product with ID ${ID} not found in storage so it can't be deleted.`)
                reply.code(404).send({error: `Product with ID ${ID} not found.`})
            }
        }
    })

}