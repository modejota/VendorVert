import { Etcd3 } from "etcd3";
require('dotenv').config()

/**
 * Clase para representar los valores para la configuración de la aplicación
 * @public
 */
class Configuration {
    private _fastify_port: any;
    private readonly _etcd_client: Etcd3;
    
    /**
     * Constructor del objeto de configuración
     */
    constructor() {

        this._etcd_client = new Etcd3({
            hosts: `${process.env["ETCD_HOST"]}:${process.env["ETCD_PORT"]}`
        });

        this.init()
    }

    // Async init as we need to wait for etcd values
    private async init() {

        (async () => {
            this._fastify_port = await this._etcd_client.get('FASTIFY_PORT').number().catch(err =>{});
        })();
        if(this._fastify_port == null && process.env.FASTIFY_PORT != undefined) {
            this._fastify_port = +process.env.FASTIFY_PORT
        } else {
            this._fastify_port = 3030
        }
    }

    /**
     * Método para obtener el puerto sobre el que escucha Fastify
     * @returns Puerto sobre el que escucha Fastify
     */
    public get fastify_port() : number {
        return this._fastify_port
    }

    /**
     * Método para obtener el cliente de etcd
     * @returns Cliente de etcd
     */
    public get etcd_client() : Etcd3 {
        return this._etcd_client
    }
    
}

export const configuration = new Configuration()