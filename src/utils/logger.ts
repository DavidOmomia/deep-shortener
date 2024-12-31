import winston from 'winston';
import { env } from './misc';

const errorFileTransport = new winston.transports.File({
  filename: 'logs/error.log',
  level: 'error',
});
const infoFileTransport = new winston.transports.File({
  filename: 'logs/info.log',
  level: 'info',
});
let consoleTransport = new winston.transports.Console({
  format: winston.format.combine(winston.format.cli(), winston.format.splat()),
});

if (env('APP_ENV') !== 'development') {
  consoleTransport = new winston.transports.Console();
}

const transports = [errorFileTransport, infoFileTransport, consoleTransport];

export const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  transports: transports,
  silent: false,
});
