import sqlize from "sequelize";


const { Sequelize } = sqlize;

const DB_HOST: string | undefined = process.env.DB_HOST;
const DB_NAME: string | undefined = process.env.DB_NAME;
const DB_USERNAME: string | undefined = process.env.DB_USERNAME;
const DB_PASSWORD: string | undefined = process.env.DB_PASSWORD;

class ConnectionInstance {
    private enableLogging: boolean;
    public connection: sqlize.Sequelize;
    constructor() {
        this.enableLogging = process.env.NODE_ENV === 'developement';
        this.connection = this.createConnection();
    }

    private createConnection(): sqlize.Sequelize {
        return new Sequelize({
            host: DB_HOST,
            database: DB_NAME,
            username: DB_USERNAME,
            password: DB_PASSWORD,
            dialect: 'postgres',
            logging: this.enableLogging 
        });
    };
};

export default ConnectionInstance;