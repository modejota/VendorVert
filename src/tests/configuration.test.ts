import { configuration as cfg  } from "../config";

describe("Test configuration", () => {
    it ('Debería existir', () => {
        expect(cfg).toBeDefined();
    })
    it ('Debería tener un cliente de etcd', () => {
        expect(cfg.etcd_client).toBeDefined();
    })

    // From now on, we are testing the default values, as we are not running etcd
    it ('Debería tener un puerto para fastify', () => {
        expect(cfg.fastify_port).toBeDefined();
        expect(cfg.fastify_port).toBe(3030);
    })

    it ('Debería tener un directorio para los logs', () => {
        expect(cfg.log_directory).toBeDefined();
        expect(cfg.log_directory).toBe("/tmp/log/vendorvert/");
    })

    it ('Debería tener un fichero para los logs', () => {
        expect(cfg.log_file).toBeDefined();
        expect(cfg.log_file).toBe("logs.json");
    })

    it ('Debería tener una ruta completa para los logs', () => {
        expect(cfg.log_file_path).toBeDefined();
        expect(cfg.log_file_path).toBe("/tmp/log/vendorvert/logs.json");
    })

})