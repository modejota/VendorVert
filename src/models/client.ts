import { Constants } from "../constants/constants";
import { ClientError } from "../errors/client_error";

/**
 * Representación simplificada de un cliente.
 * Por simplicidad, no se incluye la dirección, el teléfono, la fecha de nacimiento, fecha de alta, etc.
 * @public
 */
export class Client {
    private _id: number;
    private _nombre: string;
    private _apellidos: string;
    private _email: string;

    /**
     * Constructor del objeto cliente
     * @param id Identificador del cliente
     * @param nombre Nombre del cliente
     * @param apellidos Apellidos del cliente
     * @param email Email del cliente
     * @throws ClientError si alguno de los parámetros no es válido
     */

    //Le faltan todas las validaciones, pero ni tan mal
    constructor(id: number, nombre: string, apellidos: string, email: string) {
        if (id <= Constants.ID_INVALIDO) {
            throw new ClientError("Se intenta crear el cliente con un ID no válido");
        }
        this._id = id;
        
        if (!nombre) {
            throw new ClientError(` Se intentó crear un cliente con ID ${id} sin nombre `);
        }
        if (nombre.length < Constants.LON_NOMBRE_CLIENTE_MIN) {
            throw new ClientError(` Se intentó crear un cliente con ID ${id} con un nombre demasido corto `);
        }
        if (nombre.length > Constants.LON_NOMBRE_CLIENTE_MAX) {
            throw new ClientError(` Se intentó crear un cliente con ID ${id} con un nombre demasido largo `);
        }
        this._nombre = nombre;
        
        if (!apellidos) {
            throw new ClientError(` Se intentó crear un cliente con ID ${id} sin apellidos `);
        }
        if (apellidos.length < Constants.LON_NOMBRE_CLIENTE_MIN) {
            throw new ClientError(` Se intentó crear un cliente con ID ${id} con unos apellidos demasido cortos `);
        }
        if (apellidos.length > Constants.LON_NOMBRE_CLIENTE_MAX) {
            throw new ClientError(` Se intentó crear un cliente con ID ${id} con unos apellidos demasido largos `);
        }
        this._apellidos = apellidos;
        
        if(!email) {
            throw new ClientError(` Se intentó crear un cliente con ID ${id} sin email `);
        }
        if (Constants.EMAIL_REGEX.test(email) == false) {
            throw new ClientError(` Se intentó crear un cliente con ID ${id} con un email no válido `);
        }
        this._email = email;
    }

     /**
     * Devuelve el ID del cliente
     * @returns ID del cliente
     */
    get id(): number {
        return this._id;
    }

    /**
     * Devuelve el nombre del cliente
     * @returns Nombre del cliente
     */
    get nombre(): string {
        return this._nombre;
    }

    /**
     * Devuelve los apellidos del cliente
     * @returns Apellidos del cliente
     */
    get apellidos(): string {
        return this._apellidos;
    }

    /**
     * Devuelve el email del cliente
     * @returns Email del cliente
     */
    get email(): string {
        return this._email;
    }

}