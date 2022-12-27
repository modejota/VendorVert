/**
 * Clase para gestionar los posibles errores que puedan producirse al crear un cliente
 * @public
 */
 export class ClientError extends Error {
    /**
     * Constructor del objeto de error
     * @param msg Mensaje explicativo con el motivo del error
     */
    constructor(msg: string) {
        super(msg)
    }
}