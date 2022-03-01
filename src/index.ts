// import path from 'path';
import cors from 'cors';
import dotenv from "dotenv";
import express from "express";
// import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
// import { fileURLToPath } from 'url';

// load environment variables
dotenv.config();

// passport
import passport from 'passport';

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
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, async () => {
    try {
        await connection.authenticate();
        console.log('Database connected.');

        await connection.sync({ force: true });
        // await File.sync({ force: true });
        // await Token.sync({ force: true });
        // await UserProfiles.sync({ force: true });
        console.log('Tables synced in Database.');
    } catch (error) {
        throw new Error("Error database connection");
    }
    
    
    console.log("Server running on port:", PORT);
});