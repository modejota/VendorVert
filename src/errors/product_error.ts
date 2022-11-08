/**
 * Clase para gestionar los posibles errores que puedan producirse al construir productos
 * @public
 */
 export class ProductError extends Error {
    /**
     * Constructor del objeto de error
     * @param msg Mensaje explicativo con el motivo del error
     */
    constructor(msg: string) {
        super(msg)
    }
}
