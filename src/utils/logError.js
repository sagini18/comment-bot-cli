import { createLogger, format, transports, addColors } from "winston";
const { combine, timestamp, json, prettyPrint, printf } = format;

const errorFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const consoleFormat = printf(({ level, message }) => {
  return `${level}: ${message}`;
});

const logger = createLogger({
  level: {
    error: 0,
    info: 1,
  },
  format: combine(
    timestamp(),
    errorFormat,
    json(),
    prettyPrint(),
    format.colorize()
  ),

  transports: [
    new transports.Console({
      level: "info",
      format: format.simple(),
      format: consoleFormat,
    }),
    new transports.File({
      filename: "combined.log",
      level: "info",
      maxsize: 5242880,
      maxFiles: 5,
      tailable: true,
    }),
    new transports.File({
      filename: "error.log",
      level: "error",
      maxsize: 5242880,
      maxFiles: 5, // maximum number of log files that will be kept before older files are removed.
      tailable: true, // supports log rotation
    }),
  ],
});
addColors({ error: "red", info: "green" });

export { logger };
