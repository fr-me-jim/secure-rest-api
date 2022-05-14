// import path from 'path';
import cors from 'cors';
import dotenv from "dotenv";
import express from "express";
// import { fileURLToPath } from 'url';

// load environment variables
dotenv.config();

// passport
import passport from 'passport';

// routes
// import Routes from "./routes/index";
import router, { RouterAPI } from "./routes/index";

// database
import connection from './models/index';

// const { dirname } = path;
// const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const routerAPI = new RouterAPI();
const PORT: string | number = process.env.PORT || 9000;


app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use('/api', routerAPI.InitializeRouter());
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, async () => {
    try {
        await connection.authenticate();
        console.log('Database connected.');

        await connection.sync({ force: true });
        console.log('Tables synced in Database.');
    } catch (error: any) {
        throw new Error(error);
    }
    
    
    console.log("Server running on port:", PORT);
});