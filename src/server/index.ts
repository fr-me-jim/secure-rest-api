import express, 
{ 
    Router, 
    Request, 
    Response,
    Application, 
} from 'express';
import cors from 'cors';
import logger from "morgan";
import passport from "passport";
import { WriteStream } from "fs";
import { Sequelize, ValidationError } from "sequelize";

// router
import RouterAPI from '../routes';

export default class APIServer {
    public readonly app: Application;

    private port: number;
    private router: Router
    private debugLevel: string;
    private connection: Sequelize
    private accessLogStream: WriteStream;

    constructor(port: number, debugLevel: string, connection: Sequelize, routerAPI: RouterAPI, logWriteStream: WriteStream) {
        this.port = port;
        this.app = express();
        this.debugLevel = debugLevel;
        this.connection = connection;
        this.router = routerAPI.InitializeRouter();
        this.accessLogStream = logWriteStream;

        this.SetAssets();
        this.SetRouter();
        this.SetMiddlewares();
    }

    private readonly SetAssets = (): void => {
      this.app.use(express.static(`${__dirname}/public`));  
    };

    private readonly SetRouter = (): void => {
        this.app.use('/api', this.router);  
    };

    private readonly SetMiddlewares = (): void => {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(passport.initialize());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(logger(this.debugLevel, { stream: this.accessLogStream }));

        this.app.use(this.ExpressErrorHandler);  
    };

    private ExpressErrorHandler(error: unknown, _req: Request, res: Response): Response {
        console.log(error)
        if (error instanceof ValidationError) return res.sendStatus(400);

        return res.sendStatus(500);
    };

    /**
     * Start Server on Listening Port 
     */
    public readonly listen = (): void => {
        this.app.listen(this.port, async () => {
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