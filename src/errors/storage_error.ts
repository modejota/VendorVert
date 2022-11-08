/**
 * Clase para gestionar los posibles errores que puedan producerse al gestionar las existencias
 * @public
 */
 export class StorageError extends Error {
    /**
     * Constructor del objeto de error
     * @param msg Mensaje explicativo con el motivo del error
     */
    constructor(msg: string) {
        super(msg)
    }
}
