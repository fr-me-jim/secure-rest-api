import sqlize from "sequelize";


const { Sequelize } = sqlize;

const DB_HOST: string | undefined = process.env.DB_HOST;
const DB_NAME: string | undefined = process.env.DB_NAME;
const DB_USERNAME: string | undefined = process.env.DB_USERNAME;
const DB_PASSWORD: string | undefined = process.env.DB_PASSWORD;

const logging: boolean = process.env.NODE_ENV === 'developement';

const connection = new Sequelize({
    host: DB_HOST,
    database: DB_NAME,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    dialect: 'postgres',
    logging
});

export default connection;