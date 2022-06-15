import fs from "fs";
import path from 'path';
import cors from 'cors';
// import multer from "multer";
import logger from "morgan";
import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
// import { fileURLToPath } from 'url';

// load environment variables
dotenv.config();

// passport
import passport from 'passport';

// routes
import RouterAPI from "./routes/index";

// database
import connection from './models/index';
import { ValidationError } from "sequelize";

// config
// import storage from "./config/multer.storage";

// utils
// import { checkAllowedFiles } from './utils/helpers';

const app = express();
const routerAPI = new RouterAPI();
const PORT: string | number = process.env.PORT || 9000;
const debugLevel: string = process.env.NODE_ENV === "production" ? "combined" : "dev"; 
console.log(path.resolve('/var/log'), "server-access.log")
const accessLogStream = fs.createWriteStream(path.join(path.resolve('../logs'), "server-access.log"), { flags: 'a+' });

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use('/api', routerAPI.InitializeRouter());
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: false }));
app.use(logger(debugLevel, { stream: accessLogStream }));

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction): Response =>{
    if (error instanceof ValidationError) return res.sendStatus(400);

    return res.sendStatus(500);
});
console.log(path.join(path.resolve('../logs'), "server-access.log"))
// const upload = multer({ storage, fileFilter: (_req, file, callback) => checkAllowedFiles(file, callback) });
app.listen(PORT, async () => {
    try {
        await connection.authenticate();
        console.log('Database connected.');

        await connection.sync({ force: true, });
        console.log('Tables synced in Database.');
    } catch (error: unknown) {
        throw error;
    }
    
    console.log("Server running on port:", PORT);
});