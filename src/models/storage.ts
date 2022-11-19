import { Constants } from "../constants/constants";
import { StorageError } from "../errors/storage_error";
import { Product } from "./product";

/**
 * Representa el inventario del negocio a través de una tabla hash.
 * La clave será el ID del producto (codigo de barras), mientras que el valor será una pareja del producto y cantidad almacenada.
 * @public
 */
export class Storage {
    private _inventario: Map<number,[_producto: Product, cantidad: number]>

    /**
     * Constructor del objeto existencias
     * Crea un inventario sin productos
     */
    constructor() {
        this._inventario = new Map<number, [Product, number]>()
    }

    /**
     * Método para añadir un nuevo producto al almacén
     * @param producto Producto a insertar en el almacén
     * @param cantidad Cantidad del producto que se desea insertar
     */
    public aniadir_producto(producto: Product, cantidad = 0) {
        let key = producto.id_producto

        if (cantidad < Constants.CANTIDAD_INVALIDA) 
            throw new StorageError(` Se intentó añadir un producto con ID ${key} y cantidad ${cantidad} no válida `)

        if (this._inventario.has(key))
            throw new StorageError(` Se intentó añadir un producto con ID ${key} ya existente `)

        else
            this._inventario.set(key,[producto,cantidad])
    }

    /**
     * Método para obtener los datos de un producto y su cantidad a partir de su ID único
     * @param ID Identificador único del producto a obtener
     * @returns Tupla con el producto y cantidad del mismo
     */
    public obtener_producto(ID: number) {
        if(ID <= Constants.ID_INVALIDO)
            throw new StorageError(` Se intentó obtener un producto con ID ${ID} inválido `)

        if (this._inventario.has(ID))
            return this._inventario.get(ID)

        else
            throw new StorageError(` Se intentó obtener un producto con ID ${ID} no existente `)
    }

    /**
     * Método para eliminar un producto del almacén a partir de su identificador único
     * @param ID Identificador único del producto a eliminar
     */
    public eliminar_producto(ID: number) {
        if (ID <= Constants.ID_INVALIDO)
            throw new StorageError(` Se intentó eliminar un producto con ID ${ID} inválido `)

        if (this._inventario.has(ID))
            this._inventario.delete(ID)

        else
            throw new StorageError(` Se intentó eliminar un producto con ID ${ID} no existente `)
    }

    /**
     * Método para actualizar un producto presente en el almacen
     * @param product Producto con los datos a modificarse
     * @param new_c Nuevo valor de la cantidad en el producto
     */
    public actualizar_producto(product: Product, new_c: number) {
        let ID = product.id_producto
        if (ID <= Constants.ID_INVALIDO) 
            throw new StorageError( ` Se intentó actualizar la cantidad de un producto con ID ${ID} inválido `)
        if (this._inventario.has(ID)) {
            if (new_c >= Constants.CANTIDAD_INVALIDA)
            this._inventario.set(ID, [product, new_c])
        else    
            this._inventario.set(ID, [product,Constants.CANTIDAD_INVALIDA])
        }
        else 
            throw new StorageError( `Se intentó actualizar la cantidad del producto con ID ${ID} no presente en el almacén `)
    }

    /**
     * Método para actualizar la cantidad de la que se dispone de un determinado producto en el almacén
     * @param ID Identificador único del producto
     * @param cantidad Valor en el que debe variarse la cantidad del producto
     */
    public actualizar_cantidad_producto(ID: number, cantidad: number) {
        if (ID <= Constants.ID_INVALIDO) 
            throw new StorageError( ` Se intentó actualizar la cantidad de un producto con ID ${ID} inválido `)

        if (this._inventario.has(ID) && cantidad != Constants.CANTIDAD_INVALIDA) {
            let pair = this._inventario.get(ID)
            if (pair) { 
                let new_cantidad = pair[1] + cantidad
                if (new_cantidad < Constants.CANTIDAD_INVALIDA) {
                    throw new StorageError( `Se intentó actualizar la cantidad del producto con ID ${ID} de manera que obtenemos cantidad negativa `)
                }
                pair[1] = new_cantidad
                this._inventario.set(ID,pair)
            }
        } 
        else 
            throw new StorageError( `Se intentó actualizar la cantidad del producto con ID ${ID} no presente en el almacén `)
    }

    /**
     * Método para saber el número de productos distintos en el almacén
     * @returns Cantidad de productos distintos en el almacén
     */
    public get_num_items() {
        return this._inventario.size
    }

    /**
     * Método para obtener todos los productos del almacen
     * @returns Método para obtener todos los productos del almacen
     */
    public get inventario() {
        return this._inventario
    }

}