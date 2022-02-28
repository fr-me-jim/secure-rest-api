import dotenv from "dotenv";
import express from "express";
// import jwt from "jsonwebtoken";
import bodyParser from "body-parser";

// import routes
import router from "./routes/index";

// database
import ConnectionInstance from './models/index';

dotenv.config();
const app = express();
const PORT: string | number = process.env.PORT || 9000;

export const { connection } = new ConnectionInstance();

app.use('/api', router);
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, async () => {
    connection.authenticate();
    console.log('Database connected.');
    // await User.sync({ force: true });
    // await File.sync({ force: true });
    // await Token.sync({ force: true });
    // await UserProfiles.sync({ force: true });
    // console.log('Tables synced in Database.');
    console.log("Server running on port:", PORT);
});