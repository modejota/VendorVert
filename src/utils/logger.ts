const pino = require('pino')
const pinoElastic = require('pino-elasticsearch')
const streamToElastic = pinoElastic({
     index: 'vendorvert-logs',
     consistency: 'one',
     node: 'http://elasticsearch:9200'
})
const logger = pino({level: 'info'}, streamToElastic)
export {logger}


