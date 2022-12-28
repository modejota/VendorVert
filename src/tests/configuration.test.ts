import { configuration as cfg  } from "../config";
import * as fs from "fs";
const moment = require("moment");

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

    it ('Debería tener un directorio para los logs', () => {
        expect(cfg.log_directory).toBeDefined();
        expect(cfg.log_directory).toBe("/tmp/logs/vendorvert/");
    })

    it ('Debería tener un fichero para los logs', () => {
        expect(cfg.log_file).toBeDefined();
        expect(cfg.log_file).toBe("logs");
    })

    it ('Debería tener una ruta completa para los logs', () => {
        expect(cfg.log_file_path).toBeDefined();
        expect(cfg.log_file_path).toBe("/tmp/logs/vendorvert/logs");
        //No extension, as real name is logs-YYYY-MM-DD.log (see logger.ts)
    })

    it ('Debería tener una extensión para los logs', () => {
        expect(cfg.log_file_extension).toBeDefined();
        expect(cfg.log_file_extension).toBe(".json");
    })

    it ('Debería existir el fichero para los logs', () => {
        let realroute = cfg.log_file_path+`-${moment().format('YYYY-MM-DD')}`+cfg.log_file_extension
        expect(realroute).toBeDefined();
        expect(realroute).toBe(`/tmp/logs/vendorvert/logs-${moment().format('YYYY-MM-DD')}.json`);
        expect(fs.existsSync(realroute)).toBe(true);
    })

})