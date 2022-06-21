// import fs from 'fs';
import path from 'path';
import winston from 'winston';

const logDirPath: string = `${path.resolve('.')}/logs`;
// if (!fs.existsSync(logDirPath)) {
//     fs.mkdirSync(logDirPath, { recursive: true });
// }

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error', dirname: logDirPath }),
        new winston.transports.File({ filename: 'database.log', level: 'debug', dirname: logDirPath }),
        new winston.transports.File({ filename: 'combined.log', dirname: logDirPath }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({ format: winston.format.simple() }));
}

export default logger;