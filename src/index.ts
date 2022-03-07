// import path from 'path';
import cors from 'cors';
import dotenv from "dotenv";
import express from "express";
// import jwt from "jsonwebtoken";
// import { fileURLToPath } from 'url';

// load environment variables
dotenv.config();

// passport
import passport from 'passport';
// import PassportConfig from "./auth/passport";

// const passportConfig = new PassportConfig(passport);
// export const strategy = passportConfig.SetStrategy();

// routes
import router from "./routes/index";

// database
import connection from './models/index';

// const { dirname } = path;
// const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT: string | number = process.env.PORT || 9000;


app.use(cors());
app.use('/api', router);
app.use(express.json());
app.use(passport.initialize());
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