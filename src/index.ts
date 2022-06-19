import fs from "fs";
// import path from 'path';
import dotenv from "dotenv";
import winston from "winston";

// load environment variables
console.log("Loading environment variables...");
const result = dotenv.config();

if (result["error"]) {
    console.log("Error loading environmental variables!");
    throw result["error"];
}
console.log("Environmental variables loaded.");

// routes
import RouterAPI from "./routes/index";

// database
import connection from './models/index';

// server
import APIServer from "./server";

// const app = express();
const routerAPI = new RouterAPI();
const PORT: number = (process.env.PORT && parseInt(process.env.PORT)) || 9000;
// const debugLevel: string = process.env.NODE_ENV === "production" ? "combined" : "dev";
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
// const accessLogStream = fs.createWriteStream(path.join(path.resolve('/home/node/logs'), "server-access.log"), { flags: 'a+' });

// const server = new APIServer(PORT, debugLevel, connection, routerAPI, accessLogStream);
const server = new APIServer(PORT, connection, routerAPI);


server.listen();