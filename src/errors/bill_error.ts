/**
 * Clase para gestionar los posibles errores que puedan producirse al gestionar las facturas
 * @public
 */
 export class BillError extends Error {
    /**
     * Constructor del objeto de error
     * @param msg Mensaje explicativo con el motivo del error
     */
    constructor(msg: string) {
        super(msg)
    }
}
