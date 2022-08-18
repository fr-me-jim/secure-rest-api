import csurf from 'csurf';
import passport from "passport";
import cookieParser from "cookie-parser";
import express, { Router } from 'express';
import type {
    Request, 
    Response,
    Application,
    NextFunction
} from 'express';
// import morgan from "morgan";
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
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cookieParser(process.env.COOKIE_SIGNATURE));

        this.app.use(csurf({ 
            cookie: {
                path: '/',
                httpOnly: true,
                key: 'XSRF-Token',
                domain: 'tfm.jediupc.com',
                secure: process.env.NODE_ENV === 'production',
                signed: process.env.NODE_ENV === 'production',
            } 
        }));
        this.app.use(passport.initialize());
        this.app.all('*', function (req: Request, res: Response) {
            res.cookie('XSRF-TOKEN', req.csrfToken()).end();
            // res.render('index')
        })
        // this.app.use(morgan(this.debugLevel, { stream: this.accessLogStream }));

        this.app.use('/api', this.router);  
        this.app.use(this.ExpressErrorHandler);
    };

    private ExpressErrorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): Response {
        logger.error((error as Error).message);
        console.log(typeof error)
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
            logger.info("Starting App");
            console.log(`== NODE_ENV: ${process.env.NODE_ENV} ==`);
            try {
                await this.connection.authenticate();
                console.log('Database connected.');

                await this.connection.sync({ force: true, });
                console.log('Tables synced in Database.');
            } catch (error: unknown) {
                throw error;
            }
            
            logger.info(`Server running on port ${this.port}`);
            console.log("Server running on port:", this.port);
        }); 
    };
};