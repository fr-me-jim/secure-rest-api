import fs from "fs";
import path from 'path';
import dotenv from "dotenv";
// import winston from "winston";

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
const logDirPath: string = `${path.resolve('.')}/logs`;
const PORT: number = (process.env.PORT && parseInt(process.env.PORT)) || 9000;
const debugLevel: string = process.env.NODE_ENV === "production" ? "combined" : "dev";
const accessLogStream = fs.createWriteStream(path.join(logDirPath, "access.log"), { flags: 'a+' });

const server = new APIServer(PORT, connection, routerAPI, debugLevel, accessLogStream);
// const server = new APIServer(PORT, connection, routerAPI);


server.listen();