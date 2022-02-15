import dotenv from "dotenv";
import express from "express";


dotenv.config();
const app = express();
const PORT: string | number = process.env.PORT || 9000;

app.get('/', () => {
    console.log("hello")
});

app.listen(PORT, async () => {
    // sequelize.authenticate();
    // console.log('Database connected.');
    // await User.sync({ force: true });
    // await File.sync({ force: true });
    // await Token.sync({ force: true });
    // await UserProfiles.sync({ force: true });
    // console.log('Tables synced in Database.');
    console.log("Server running on port:", PORT);
});