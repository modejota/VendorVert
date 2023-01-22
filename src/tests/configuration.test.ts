import { configuration as cfg  } from "../config";

describe("Test configuration", () => {
    it ('Debería existir', () => {
        expect(cfg).toBeDefined();
    })
    it ('Debería tener un cliente de etcd', () => {
        expect(cfg.etcd_client).toBeDefined();
    })

    // From now on, we are testing the default values, as we are not running etcd
    // In local, values comes from .env file, with same values as default values
    it ('Debería tener un puerto para fastify', () => {
        expect(cfg.fastify_port).toBeDefined();
        expect(cfg.fastify_port).toBe(3030);
    })

})