// import path from 'path';
import cors from 'cors';
// import multer from "multer";
import logger from "morgan";
import dotenv from "dotenv";
import express from "express";
// import { fileURLToPath } from 'url';

// load environment variables
dotenv.config();

// passport
import passport from 'passport';

// routes
import RouterAPI from "./routes/index";

// database
import connection from './models/index';

// config
// import storage from "./config/multer.storage";

// utils
// import { checkAllowedFiles } from './utils/helpers';

const app = express();
const routerAPI = new RouterAPI();
const PORT: string | number = process.env.PORT || 9000;

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(passport.initialize());
app.use('/api', routerAPI.InitializeRouter());
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: false }));

// const upload = multer({ storage, fileFilter: (_req, file, callback) => checkAllowedFiles(file, callback) });
console.log(__dirname)
app.listen(PORT, async () => {
    try {
        await connection.authenticate();
        console.log('Database connected.');

        await connection.sync({ force: true });
        console.log('Tables synced in Database.');
    } catch (error: unknown) {
        throw error;
    }
    
    
    console.log("Server running on port:", PORT);
});