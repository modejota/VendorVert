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
    static readonly LON_NOMBRE_MAX:number = 48

    /**
     * Longitud mínima del nombre de la marca/fabricante de un producto
     */
    static readonly LON_MARCA_MIN:number = 2

    /**
     * Longitud máxima del nombre de la marca/fabricante de un producto
     */
    static readonly LON_MARCA_MAX:number = 24

    /**
     * Valor para representar IDs inválidos de productos
     */
    static readonly ID_INVALIDO: number = 0

    /**
     * Valor para representar una cantidad invalida de un producto
     */
    static readonly CANTIDAD_INVALIDA: number = 0

}