import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp, ...extra }) => {
  let strData = "";
  if (Object.keys(extra).length) {
    strData = `\n${JSON.stringify(extra, null, 3)}`;
  }
  return `\n${timestamp} [${level.toUpperCase()}] ${message}${strData}`;
});

const logger = createLogger({
  level: "debug",
  format: combine(timestamp({ format: "DD-MM-YYYY HH:mm:ss" }), logFormat),
  transports: [
    new transports.File({ filename: "src/logger/app.log", level: "info" }),
  ],
});

export default logger;
