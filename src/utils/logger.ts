const moment = require("moment");
import { configuration } from "../config";
import * as fs from "fs";
import pino from "pino";

const log_directory = configuration.log_directory
const log_file_path = configuration.log_file_path
const log_file_extension = configuration.log_file_extension

if(!fs.existsSync(log_directory)) {
     fs.mkdirSync(log_directory,{ recursive: true })
}

const real_log_file_path = log_file_path+`-${moment().format('YYYY-MM-DD')}`+log_file_extension

export const logger = pino({
     timestamp: () => `,"time":"${moment().format('HH:mm:ss')}"`,
}, pino.destination(real_log_file_path))
