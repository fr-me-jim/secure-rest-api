import { Router } from "express";
import passport, { PassportStatic } from 'passport';

// config 
import PassportConfig from "../auth/passport";

// interfaces
import { IUserRepository } from "../interfaces/User.interface";
import { ITokenRepositories } from "src/interfaces/Token.interface";

// repositories
import UserRepositories from '../repositories/User.repositories';
import TokenRepositories from '../repositories/Token.repositories';

// middlewares
import { 
    isAdminUser,
    isTokenBlacklisted 
} from '../middlewares/auth.middlewares';

// routes
import AuthRouter from './Auth.routes';
import UserRouter from './User.routes';
import AdminRouter from "./Admin.routes";

export default class RouterAPI {
    private router: Router;
    public readonly strategy: PassportStatic;
    public readonly middlewares: { (): void }[];

    public readonly UserRepository: IUserRepository;
    public readonly TokenRepository: ITokenRepositories;

    private AuthRouter: Router;
    private UserRouter: Router;
    private AdminRouter: Router;

    constructor() {
        this.router = Router();
        
        this.UserRepository = new UserRepositories();
        this.TokenRepository = new TokenRepositories();

        this.strategy = new PassportConfig(passport, this.UserRepository).SetStrategy();

        this.middlewares = [ 
            this.strategy.authenticate('jwt', { session: false }), 
            isTokenBlacklisted 
        ];

        this.AuthRouter = new AuthRouter(this).SetRoutes();    
        this.UserRouter = new UserRouter(this).SetRoutes();
        this.AdminRouter = new AdminRouter(this).SetRoutes();
    };

    public readonly InitializeRouter = (): Router => {

        this.router.use('/', this.AuthRouter);
        this.router.use('/users', ...this.middlewares, this.UserRouter);
        this.router.use('/admin', ...this.middlewares, isAdminUser, this.AdminRouter);

        return this.router;
    };
};