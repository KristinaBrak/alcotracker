import winston, { format } from 'winston';
import path from 'path';

// levels "fatal" | "error" | "warn" | "info" | "debug" | "trace"

const myFormat = winston.format.printf(
  ({ level, message, timestamp, label }) =>
    `${timestamp} ${level} [${label}]: ${message}`,
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL?.toLowerCase() || 'info',
  format: format.combine(
    format.errors({ stack: true }),
    format.label({ label: path.basename(require.main?.filename ?? '') }),
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.splat(),
    myFormat,
  ),
  transports: [new winston.transports.Console()],
});
