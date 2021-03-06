import express, 
{ 
    Router, 
    Request, 
    Response,
    Application, 
} from 'express';
import cors from 'cors';
// import morgan from "morgan";
import passport from "passport";
// import cookieParser from "cookie-parser";
// import { WriteStream } from "fs";

// errors
import { 
    Sequelize, 
    ValidationError, 
    ValidationErrorItem, 
    SequelizeScopeError
} from "sequelize";
import TypeGuardError from '../errors/TypeGuardError.error';

// router
import RouterAPI from '../routes';

// logger
import logger from '../config/logger.config';

export default class APIServer {
    public readonly app: Application;

    private port: number;
    private router: Router
    // private debugLevel: string;
    private connection: Sequelize
    // private accessLogStream: WriteStream;

    constructor(port: number, connection: Sequelize, routerAPI: RouterAPI, 
        // debugLevel: string, 
        // logWriteStream: WriteStream
    ) {
        this.port = port;
        this.app = express();
        // this.debugLevel = debugLevel;
        this.connection = connection;
        this.router = routerAPI.InitializeRouter();
        // this.accessLogStream = logWriteStream;


        this.SetAssets();
        this.SetMiddlewares();
    };

    private readonly SetAssets = (): void => {
      this.app.use(express.static(`${__dirname}/public`));  
    };

    private readonly SetMiddlewares = (): void => {
        this.app.use(cors());
        this.app.use(express.json());
        // this.app.use(cookieParser());
        this.app.use(passport.initialize());
        this.app.use(express.urlencoded({ extended: false }));
        // this.app.use(morgan(this.debugLevel, { stream: this.accessLogStream }));

        this.app.use('/api', this.router);  
        this.app.use(this.ExpressErrorHandler);
    };

    private ExpressErrorHandler(error: any, _req: Request, res: Response): Response {
        logger.error(error.message);
        if (error instanceof TypeGuardError) return res.sendStatus(400);
        if (error instanceof ValidationError) return res.sendStatus(400);
        if (error instanceof ValidationErrorItem) return res.sendStatus(400);
        if (error instanceof SequelizeScopeError) return res.sendStatus(400);
        
        return res.sendStatus(500);
    };

    /**
     * Start Server on Listening Port 
     */
    public readonly listen = (): void => {
        this.app.listen(this.port, async () => {
            console.log(`== NODE_ENV: ${process.env.NODE_ENV} ==`);
            try {
                await this.connection.authenticate();
                console.log('Database connected.');

                await this.connection.sync({ force: true, });
                console.log('Tables synced in Database.');
            } catch (error: unknown) {
                throw error;
            }
            
            console.log("Server running on port:", this.port);
        }); 
    };
};