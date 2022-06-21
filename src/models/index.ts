import sqlize from "sequelize";

// logging
import logger from '../config/logger.config';


const { Sequelize } = sqlize;

const DB_HOST: string | undefined = process.env.DB_HOST;
const DB_NAME: string | undefined = process.env.DB_NAME;
const DB_PORT: number | undefined = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined;
const DB_USERNAME: string | undefined = process.env.DB_USERNAME;
const DB_PASSWORD: string | undefined = process.env.DB_PASSWORD;

const connection = new Sequelize({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    dialect: 'postgres',
    logging: msg => logger.debug(msg)
});

export default connection;