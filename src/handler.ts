import { Bill } from "./models/bill";
import { Storage } from "./models/storage";
import { Product } from "./models/product";
import { BillError } from "./errors/bill_error";
import { Constants } from "./constants/constants";
import { ProductType } from "./models/product_type";
import { StorageError } from "./errors/storage_error";
import { HandlerError } from "./errors/handler_error";
import { ProductError } from "./errors/product_error";

class Handler {
    private _existencias: Storage; 
    private _facturas: Map<number, Bill> 
    private _last_err_message: string;

    /**
     * Constructor del objeto manejador
     * Crea un inventario vacío y una lista de facturas vacía
     */
    constructor() {
        this._existencias = new Storage();
        this._facturas = new Map();
        this._last_err_message = "";
    }

    /**
     * Método para crear un objeto del tipo Producto
     * 
     * @param id_producto ID único asignado a cada producto
     * @param nombre Nombre del producto
     * @param marca Marca y/o fabricante del producto
     * @param tipo Tipo de producto en el que se enmarca
     * @param PVP Precio de venta del producto
     * @returns Objeto del tipo producto debidamente inicializado
     */
     public crear_producto(id_producto:number, nombre:string, marca:string, tipo:ProductType, PVP:number): Product {
        try {
            let producto = new Product(id_producto,nombre,marca,tipo,PVP) 
            return producto
        } catch (exception) {
            if (exception instanceof ProductError)
                this._last_err_message = exception.message
            throw new HandlerError(this._last_err_message)
        }  
    }
    
    /**
     * Método para añadir un nuevo producto al almacén
     * @param producto Producto a insertar en el almacén
     * @param cantidad Cantidad del producto que se desea insertar
     */
     public aniadir_producto_almacen(producto: Product, cantidad = 0) {
        try {
            this._existencias.aniadir_producto(producto,cantidad)
        } catch (exception) {
            if (exception instanceof StorageError)
                this._last_err_message = exception.message
            throw new HandlerError(this._last_err_message)
        }
    }

    /**
     * Método para obtener los datos de un producto y su cantidad a partir de su ID único
     * @param ID Identificador único del producto a obtener
     * @returns Tupla con el producto y cantidad del mismo
     */
    public obtener_producto_almacen(ID:number): [Product,number] {
        try {
            let producto = this._existencias.obtener_producto(ID) as [Product,number]
            return producto
        } catch (exception) {
            if (exception instanceof StorageError)
                this._last_err_message = exception.message
            throw new HandlerError(this._last_err_message)
        }
    }

    /**
     * Método para eliminar un producto del almacén a partir de su identificador único
     * @param ID Identificador único del producto a eliminar
     */
    public eliminar_producto_almacen(ID:number) {
        try {
            this._existencias.eliminar_producto(ID)
        } catch (exception) {
            if (exception instanceof StorageError)
                this._last_err_message = exception.message
            throw new HandlerError(this._last_err_message)
        }
    }

    /**
     * Método para actualizar un determinado producto presente en el almacén
     * @param producto Producto con los valores a actualizar
     * @param cantidad Nueva cantidad del producto
     */
    public actualizar_producto_almacen(producto: Product, cantidad: number) {
        try {
            this._existencias.actualizar_producto(producto,cantidad)
        } catch (exception) {
            if (exception instanceof StorageError)
                this._last_err_message = exception.message
            throw new HandlerError(this._last_err_message)
        }
    }

    /**
     * Método para actualizar la cantidad de la que se dispone de un determinado producto en el almacén
     * @param ID Identificador único del producto
     * @param cantidad Valor en el que debe variarse la cantidad del producto
     */
     public actualizar_cantidad_producto_almacen(ID: number, cantidad: number) {
        try {
            this._existencias.actualizar_cantidad_producto(ID,cantidad)
        } catch (exception) {
            if (exception instanceof StorageError)
                this._last_err_message = exception.message
            throw new HandlerError(this._last_err_message)
        }
    }

    /**
     * Método para saber el número de productos distintos en el almacén
     * @returns Cantidad de productos distintos en el almacén
     */
    public get_num_items_almacen(): number {
        return this._existencias.get_num_items()
    }

    /**
     * Método para crear una factura sin productos vendidos y añadirla al sistema
     * @param ID_factura ID único de la factura a crear
     * @param fecha Fecha en la que se crea la factura
     */
    public crear_factura(ID_factura:number, fecha = new Date()) {
        if (ID_factura <= Constants.ID_INVALIDO) {
            this._last_err_message = `Se intentó crear una factura con ID ${ID_factura} inválido.`
            throw new HandlerError(this._last_err_message)
        } else if (this._facturas.has(ID_factura)) {
            this._last_err_message = `Se intentó crear una factura con ID ${ID_factura} ya existente`
            throw new HandlerError(this._last_err_message)
        } else {
            let factura = new Bill(fecha)
            this._facturas.set(ID_factura,factura)
        }
    }

    /**
     * Método para obtener una factura a partir de su identificador único
     * @param ID_factura ID único de la factura a obtener
     * @returns Objeto factura con el identificador único solicitado
     */
    public obtener_factura(ID_factura:number): Bill {
        if (ID_factura <= Constants.ID_INVALIDO) {
            this._last_err_message = `Se intentó obtener una factura con ID ${ID_factura} inválido.`
            throw new HandlerError(this._last_err_message)
        } else if (!this._facturas.has(ID_factura)) {
            this._last_err_message = `Se intentó obtener una factura con ID ${ID_factura} no existente`
            throw new HandlerError(this._last_err_message)
        } else {
            return this._facturas.get(ID_factura) as Bill
        }
    }

    /**
     * Método para eliminar una factura a partir de su identificador único
     * @param ID_factura ID único de la factura a eliminar
     */
    public eliminar_factura(ID_factura:number) {
        if (!this._facturas.has(ID_factura)) {
            this._last_err_message = `Se intentó eliminar una factura con ID ${ID_factura} no existente`
            throw new HandlerError(this._last_err_message)
        } 
        else {
            this._facturas.delete(ID_factura)
        }
    }

    /**
     * Método para añadir un nuevo producto vendido a una factura
     * @param ID Identificador único de la factura
     * @param producto Producto que se ha vendido
     * @param cantidad Cantidad del producto que se ha vendido
     */
    public aniadir_producto_factura(ID:number,producto:Product,cantidad=0) {
        if (!this._facturas.has(ID)) {
            this._last_err_message = `Se intentó añadir un producto a una factura con ID ${ID} no existente`
            throw new HandlerError(this._last_err_message)
        } 
        else {
            try {
                let factura = this._facturas.get(ID)
                if(factura) {
                    factura.aniadir_producto(producto,cantidad)
                    this._facturas.set(ID,factura)
                }
            } catch (exception) {
                if (exception instanceof BillError)
                    this._last_err_message = exception.message
                throw new HandlerError(this._last_err_message)
            }
        }
    }

    /**
     * Método para añadir obtener los datos de un producto presente factura
     * @param ID Identificador único de la factura
     * @param ID_producto Identificador único del producto a obtener
     * @returns Pareja con el producto solicitado y la cantidad vendida
     */
    public obtener_producto_factura(ID_factura:number,ID_producto:number): [Product,number] {
        if (!this._facturas.has(ID_factura)) {
            this._last_err_message = `Se intentó obtener un producto a una factura con ID ${ID_factura} no existente`
            throw new HandlerError(this._last_err_message)
        } else {
            try {
                let producto = this._facturas.get(ID_factura)?.obtener_producto(ID_producto) as [Product,number]
                return producto
                
            } catch (exception) {
                if (exception instanceof BillError)
                    this._last_err_message = exception.message
                throw new HandlerError(this._last_err_message) 
            }
        }
    }

    /**
     * Método para eliminar un producto de una factura a partir de sus identificadores únicos
     * @param ID_factura Identificador único de la factura
     * @param ID_producto Identificador único del producto a eliminar
     */
    public eliminar_producto_factura(ID_factura:number,ID_producto:number) {
        if (!this._facturas.has(ID_factura)) {
            this._last_err_message = `Se intentó eliminar un producto de una factura con ID ${ID_factura} no existente`
            throw new HandlerError(this._last_err_message)
        } else {
            try {
                this._facturas.get(ID_factura)?.eliminar_producto(ID_producto)
            } catch (exception) {
                if (exception instanceof BillError)
                    this._last_err_message = exception.message
                throw new HandlerError(this._last_err_message) 
            }
        }
    }

    /**
     * Método para actualizar un producto en una factura
     * @param ID_factura Identificador único de la factura
     * @param producto Producto con los datos a ser actualizados
     * @param new_c Nueva cantidad del producto 
     */
    public actualizar_producto_factura(ID_factura: number, producto:Product,new_c:number) {
        let ID_producto = producto.id_producto
        if (!this._facturas.has(ID_factura)) {
            this._last_err_message = `Se intentó eliminar un producto de una factura con ID ${ID_factura} no existente`
            throw new HandlerError(this._last_err_message)
        } else {
            try {
                this._facturas.get(ID_factura)?.actualizar_producto(producto,new_c)
            } catch (exception) {
                if (exception instanceof BillError)
                    this._last_err_message = exception.message
                throw new HandlerError(this._last_err_message) 
            }
        }
    }

    /**
     * Método para actualizar la cantidad de un producto en una factura
     * @param ID_factura Identificador único de la factura
     * @param ID_producto Identificador único del producto
     * @param new_c Nueva cantidad del producto con identificador ID
     */
    public actualizar_cantidad_producto_factura(ID_factura:number,ID_producto:number,new_c:number) {
        if (!this._facturas.has(ID_factura)) {
            this._last_err_message = `Se intentó eliminar un producto de una factura con ID ${ID_factura} no existente`
            throw new HandlerError(this._last_err_message)
        } else {
            try {
                this._facturas.get(ID_factura)?.actualizar_cantidad_producto(ID_producto,new_c)
            } catch (exception) {
                if (exception instanceof BillError)
                    this._last_err_message = exception.message
                throw new HandlerError(this._last_err_message) 
            }
        }
    }
    
    /**
     * Método para calcular el importe total de una factura
     * @param ID_factura Identificador único de la factura
     * @returns Importe total de la factura
     */
    public calcular_total_factura(ID_factura:number): number {
        if (!this._facturas.has(ID_factura)) {
            this._last_err_message = `Se intentó calcular el total de una factura con ID ${ID_factura} no existente`
            throw new HandlerError(this._last_err_message)
        } else {
            let total = this._facturas.get(ID_factura)?.calcular_total() as number
            return total
        }
    }

    /**
     * Método para calcular el numero de productos distintos presentes en una factura
     * @param ID_factura Identificador único de la factura
     * @returns Numero de productos distintos
     */
    public get_num_items_factura(ID_factura:number): number {
        if (!this._facturas.has(ID_factura)) {
            this._last_err_message = `Se intentó obtener el numero de productos de una factura con ID ${ID_factura} no existente`
            throw new HandlerError(this._last_err_message)
        } else {
            let num_items = this._facturas.get(ID_factura)?.get_num_items() as number
            return num_items
        }
    }

    /**
     * Método para calcular el numero de facturas almacenadas en el sistema
     * @returns Numero de facturas distintas
     */
    public get_num_facturas(): number {
        return this._facturas.size
    }

    /**
     * Método para obtener todas las facturas disponibles en el sistema
     * @returns Facturas (y correspondientes IDs) presentes en el sistema
     */
    public get_all_facturas(): Map<number, Bill> {
        return this._facturas
    }

    /**
     * Método para obtener todos los productos del almacen
     * @returns Productos presentes en el almacen
     */
    public get_all_productos_almacen() {
        return this._existencias.inventario;
    }

}

export const handler = new Handler()