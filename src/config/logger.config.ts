import fs from 'fs';
import winston from 'winston';

const logsDir: string = `/var/log/server`; 
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error', dirname: logsDir }),
        new winston.transports.File({ filename: 'combined.log', dirname: logsDir }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({ format: winston.format.simple() }));
}

export default logger;