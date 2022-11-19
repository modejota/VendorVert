/**
 * Clase para gestionar los posibles errores que puedan producirse en el gestor general de la aplicación
 * @public
 */
 export class HandlerError extends Error {
    /**
     * Constructor del objeto de error
     * @param msg Mensaje explicativo con el motivo del error
     */
    constructor(msg: string) {
        super(msg)
    }
}