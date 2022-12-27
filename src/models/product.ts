import { Constants } from "../constants/constants";
import { ProductError } from "../errors/product_error";
import { ProductType } from "./product_type";

/**
 * Representa un producto del inventario
 * @public
 */
export class Product {
    
    private _id_producto:number;
    private _nombre:string;
    private _marca:string;
    private _tipo:ProductType;
    private _PVP:number;

    /**
     * Constructor del objeto producto
     * 
     * @param id_producto ID único asignado a cada producto
     * @param nombre Nombre del producto
     * @param marca Marca y/o fabricante del producto
     * @param tipo Tipo de producto en el que se enmarca
     * @param PVP Precio de venta del producto
     * @throws ProductError si alguno de los parámetros no es válido
     */
    constructor(id_producto:number, nombre:string, marca:string, tipo:ProductType, PVP:number) {

        if(id_producto <= Constants.ID_INVALIDO) {
            throw new ProductError("Se intenta crear el producto con un ID no válido");
        }
        this._id_producto = id_producto;


        if (!nombre) {
            throw new ProductError(` Se intentó crear un producto con ID ${id_producto} sin nombre `);
        } 
        if (nombre.length < Constants.LON_NOMBRE_MIN) {
            throw new ProductError(` Se intentó crear un producto con ID ${id_producto} con un nombre demasido corto `);
        } 
        if (nombre.length > Constants.LON_NOMBRE_MAX) {
            throw new ProductError(` Se intentó crear un producto con ID ${id_producto} con un nombre demasido largo `);
        }
        this._nombre = nombre;

        if(!marca) {
            throw new ProductError(` Se intentó crear un producto con ID ${id_producto} y nombre ${nombre} sin marca `);
        } 
        if (marca.length < Constants.LON_MARCA_MIN) {
            throw new ProductError(` Se intentó crear un producto con ID ${id_producto} y nombre ${nombre} con una marca muy corta `);
        }
        if (marca.length > Constants.LON_MARCA_MAX) {
            throw new ProductError(` Se intentó crear un producto con ID "${id_producto} y nombre ${nombre} con una marca muy larga`);
        }
        this._marca = marca;

        if(!PVP) {
            throw new ProductError(` Se intentó crear un producto con ID ${id_producto}, nombre ${nombre}, marca ${marca} sin PVP `);
        } 
        if(PVP <= Constants.CANTIDAD_INVALIDA) {
            throw new ProductError(` Se intentó crear un producto con ID ${id_producto}, nombre ${nombre}, marca ${marca} y PVP inválido `);
        }
        this._PVP = PVP;

        if(!tipo) {
            throw new ProductError(` Se intentó crear un producto con ID ${id_producto}, nombre ${nombre}, marca ${marca} y PVP ${PVP} sin tipo `);
        }
        this._tipo = tipo;
    }

    /**
     * Devuelve el identificador único del producto
     * @returns ID único del producto
     */
    public get id_producto() { 
        return this._id_producto;
    }

    /**
     * Devuelve el nombre del producto
     * @returns Nombre del producto
     */
    public get nombre() { 
        return this._nombre;   
    }

    /**
     * Devuelve la marca y/o fabricante del producto
     * @returns Marca/fabricante del producto
     */
    public get marca() { 
        return this._marca;
    }

    /**
     * Devuelve el tipo de producto
     * @returns Tipo de producto
     */
    public get tipo() { 
        return this._tipo;
    }

    /**
     * Devuelve el precio de venta del producto
     * @returns PVP del producto
     */
    public get PVP() {
        return this._PVP;
    }

}