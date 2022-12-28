//This file is likely to be modified or just deleted in the future as hash tables are sustituted by databases.

import { Bill } from "../models/bill";
import { Client } from "../models/client";
import { Product } from "../models/product";

export function parseFactura(id: number, factura: Bill) {
    let jsonObject = {
        "id": id,
        "productos": {},
        "fecha": "undefined",
        "cliente": "undefined",
    }
    jsonObject.productos = JSON.stringify(Object.fromEntries(factura.productos))
    jsonObject.fecha = JSON.stringify(factura.fecha)
    jsonObject.cliente = JSON.stringify(factura.client.id)
    return jsonObject
}

export function parseFacturas(facturas: Map<number, Bill>) {
    let matrix: any = [];
    facturas.forEach((value: Bill, key: number) => {
        matrix.push(parseFactura(key, value))
    })
    return matrix
}

export function parseClientes(clientes: Map<number, Client>) {
    let matrix: any = [];
    clientes.forEach((value: Client, key: number) => {
        matrix.push(JSON.parse(JSON.stringify(value)))
    })
    return matrix
}

export function parseProductos(productos: Map<number, [_producto: Product, cantidad: number]>) {
    let matrix: any = [];
    productos.forEach((value: [_producto: Product, cantidad: number], key: number) => {
        let object = JSON.parse(JSON.stringify(value[0]))
        object["_cantidad"] = value[1]
        matrix.push(object)
    })
    return matrix
}
