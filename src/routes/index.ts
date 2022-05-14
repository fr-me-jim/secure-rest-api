import { Router } from "express";
import passport, { PassportStatic } from 'passport';

// config 
import PassportConfig from "../auth/passport";

// interfaces
import { IUserRepository } from "../interfaces/User.interface";
import { ITokenRepositories } from "src/interfaces/Token.interface";


// const passportConfig = new PassportConfig(passport, new UserRepositories());
// export const strategy = passportConfig.SetStrategy();

// middlewares
import { isTokenBlacklisted, isAdminUser } from '../middlewares/auth.middlewares';
// export const middlewares = [ 
//     strategy.authenticate('jwt', { session: false }), 
//     isTokenBlacklisted 
// ];

// repositories
import UserRepositories from '../repositories/User.repositories';
import TokenRepositories from '../repositories/Token.repositories';

// routes
import AuthRouter from './Auth.routes';
import UserRouter from './User.routes';
import AdminRouter from "./Admin.routes";

const router = Router();

// router.use('/', AuthRoutes);
// router.use('/users', ...middlewares, UserRoutes);
// router.use('/admin', ...middlewares, isAdminUser, AdminRoutes);

export class RouterAPI {
    protected router: Router;
    protected strategy: PassportStatic;
    protected middlewares: { (): void }[];

    protected UserRepository: IUserRepository;
    protected TokenRepository: ITokenRepositories;

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

        this.AuthRouter = new AuthRouter().SetRoutes();    
        this.UserRouter = new UserRouter().SetRoutes();
        this.AdminRouter = new AdminRouter().SetRoutes();
    };

    public readonly InitializeRouter = (): Router => {
        // TODO: add instances
        this.router.use('/', this.AuthRouter);
        this.router.use('/users', ...this.middlewares, this.UserRouter);
        this.router.use('/admin', ...this.middlewares, isAdminUser, this.AdminRouter);

        return this.router;
    };
};

export default router;
