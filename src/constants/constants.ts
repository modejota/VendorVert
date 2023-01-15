/**
 * Clase pare representar los valores constantes, comunes a todo el programa
 * @public
 */
 export abstract class Constants {
    /**
     * Longitud minima del nombre de un producto
     */
    static readonly LON_NOMBRE_MIN:number = 4

    /**
     * Longitud máxima del nombre de un producto
     */
    static readonly LON_NOMBRE_MAX:number = 64

    /**
     * Longitud mínima del nombre de la marca/fabricante de un producto
     */
    static readonly LON_MARCA_MIN:number = 2

    /**
     * Longitud máxima del nombre de la marca/fabricante de un producto
     */
    static readonly LON_MARCA_MAX:number = 48

    /**
     * Longitud mínima del nombre de un cliente
     */
    static readonly LON_NOMBRE_CLIENTE_MIN:number = 2

    /**
     * Longitud máxima del nombre de un cliente
     */
    static readonly LON_NOMBRE_CLIENTE_MAX:number = 32

    /**
     * Longitud mínima del apellido de un cliente
     */
    static readonly LON_APELLIDOS_CLIENTE_MIN:number = 3

    /**
      * Longitud máxima del nombre de un cliente
      */
    static readonly LON_APELLIDOS_CLIENTE_MAX:number = 48

    /**
     * Valor para representar IDs inválidos de productos
     */
    static readonly ID_INVALIDO: number = 0

    /**
     * Valor para representar una cantidad invalida de un producto
     */
    static readonly CANTIDAD_INVALIDA: number = 0

    /**
     * Expresión regular para validar el formato de un email
     */
    static readonly EMAIL_REGEX: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;


}