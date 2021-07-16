import winston from 'winston';
import config from '../config';
const newrelicFormatter = require('@newrelic/winston-enricher');

const logDate:string =  config.date;

const loggerInstance = winston.createLogger({
  
  format: winston.format.combine(
        winston.format.timestamp({
        format: 'MM-DD-YYYY HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.simple(),
        newrelicFormatter()
    ),
  defaultMeta: { service: 'report-manager-service' },
  transports: [
    new winston.transports.Console()
  ],
});

if(config.dev){
  // - Write all logs with level `error` and below to `error.log`
  // - Write all logs with level `info` and below to `combined.log`
  loggerInstance.add(new winston.transports.File({ filename: `logs/error/error_${logDate}.log`, level: 'error' }))
  loggerInstance.add(new winston.transports.File({ filename: `logs/info/combined_${logDate}.log`}))
}

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
/* if (config.dev) {
  loggerInstance.add(new winston.transports.Console({
    format: winston.format.combine(
      
        winston.format.timestamp({
        format: 'MM-DD-YYYY HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.colorize(),
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.simple(),
        winston.format.align()
    ),
  }));
} */

export default loggerInstance;