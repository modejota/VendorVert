import { Product } from "./product";
import { BillError } from "../errors/bill_error";
import { Constants } from "../constants/constants";
import { Client } from "./client";

/**
 * Representa una factura del negocio
 * @public
 */
export class Bill {
    private _productos: Map<number,[_producto: Product, cantidad: number]>;
    private _fecha: Date;
    private _client: Client;
    
    /**
     * Constructor del objeto ventas
     * Crea una venta sin productos
     * @param fecha Fecha en la que se genera la venta
     * @param client Cliente que realiza la compra
     */
    constructor(fecha: Date = new Date(), client: Client) {
        this._productos = new Map<number, [Product, number]>();
        this._fecha = fecha;
        this._client = client;
    }

    /**
     * Devuelve la fecha en la que se genera la factura
     * @returns Fecha de la factura
     */
    public get fecha() {
        return this._fecha;
    }

    /**
     * Devuelve el cliente que realiza la compra
     * @returns Cliente de la factura
     */
    public get client() {
        return this._client;
    }

    /**
     * Modifica el cliente de la factura
     * @param client Nuevo cliente de la factura
     */
    public set client(client: Client) {
        this._client = client;
    }

    /**
     * Método para añadir un nuevo producto a la venta
     * @param producto Producto que se ha vendido
     * @param cantidad Cantidad del producto que se ha vendido
     */
    public aniadir_producto(producto: Product, cantidad = 0) {
        let key = producto.id_producto
        if (cantidad < Constants.CANTIDAD_INVALIDA) 
            throw new BillError(` Se intentó vender un producto con ID ${key} y cantidad ${cantidad} no válida `)

        if (this._productos.has(key))
            throw new BillError(` Se intentó vender un producto con ID ${key} ya existente `)
        else
            this._productos.set(key,[producto,cantidad])
    }

    /**
     * Método para obtener los datos de un producto y su cantidad a partir de su ID único
     * @param ID Identificador único del producto a obtener
     * @returns Tupla con el producto y cantidad del mismo
     */
    public obtener_producto(ID: number) {
        if (ID <= Constants.ID_INVALIDO)
            throw new BillError(` Se intentó obtener un producto con ID ${ID} inválido `)
        if (this._productos.has(ID))
            return this._productos.get(ID)
        else
            throw new BillError(` Se intentó obtener un producto con ID ${ID} no presente en la factura `)
    }
    
    /**
     * Método para eliminar un producto de la factura a partir de su identificador único
     * @param ID Identificador único del producto a eliminar
     */
    public eliminar_producto(ID: number) {
        if (ID <= Constants.ID_INVALIDO)
            throw new BillError(` Se intentó eliminar un producto con ID ${ID} inválido `)
        if (this._productos.has(ID))
            this._productos.delete(ID)
        else
            throw new BillError(` Se intentó eliminar un producto con ID ${ID} no presente en la factura `)
    }

    /**
     * Método para actualizar la cantidad de un producto en una factura
     * @param ID Identificador único del producto
     * @param new_c Nueva cantidad del producto con identificador ID
     */
    public actualizar_cantidad_producto(ID: number, new_c: number) {
        if (ID <= Constants.ID_INVALIDO)
            throw new BillError(` Se intentó acceder un producto con ID ${ID} inválido `)
        if (this._productos.has(ID)) {
            let producto = this._productos.get(ID)?.[0]
            if (new_c >= Constants.CANTIDAD_INVALIDA)
                this._productos.set(ID, [producto as Product, new_c])
            else
                this._productos.set(ID, [producto as Product, Constants.CANTIDAD_INVALIDA])
        } else 
            throw new BillError( `Se intentó acceder a un producto con ID ${ID} no presente en la factura `)
    }

    /**
     * Método para actualizar un producto en una factura
     * @param ID Identificador único del producto
     * @param new_c Nueva cantidad del producto con identificador ID
     */
    public actualizar_producto(product: Product, new_c: number) {
        let ID = product.id_producto
        if (ID <= Constants.ID_INVALIDO)
            throw new BillError(` Se intentó acceder un producto con ID ${ID} inválido `)
        if (this._productos.has(ID)) {
            if (new_c >= Constants.CANTIDAD_INVALIDA)
                this._productos.set(ID, [product, new_c])
            else    
                this._productos.set(ID, [product,Constants.CANTIDAD_INVALIDA])
        } else 
            throw new BillError( `Se intentó acceder a un producto con ID ${ID} no presente en la factura `)
    }

    /**
     * Método para calcular el importe total de una factura
     * @returns Total de la factura
     */
    public calcular_total() {
        let total: number = 0 
        this._productos.forEach((value: [_producto: Product, cantidad: number], key: number) => {
            total += (value[0].PVP * value[1])
        })
        return total
    }

    /**
     * Método para obtener el número de productos presentes en una factura
     * @returns Cantidad de productos distintos en la factura
     */
    public get_num_items() {
        return this._productos.size
    }

    /**
     * Método para obtener todos los productos presentes en la factura
     * @returns Todos los productos presentes en la factura
     */
    public get productos() {
        return this._productos
    }

}