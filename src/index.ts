import fs from "fs";
import path from 'path';
import dotenv from "dotenv";

// load environment variables
dotenv.config();

// routes
import RouterAPI from "./routes/index";

// database
import connection from './models/index';

// server
import APIServer from "./server";

// const app = express();
const routerAPI = new RouterAPI();
const PORT: number = (process.env.PORT && parseInt(process.env.PORT)) || 9000;
const debugLevel: string = process.env.NODE_ENV === "production" ? "combined" : "dev"; 
const accessLogStream = fs.createWriteStream(path.join(path.resolve('/home/node/logs'), "server-access.log"), { flags: 'a+' });

const server = new APIServer(PORT, debugLevel, connection, routerAPI, accessLogStream);


server.listen();