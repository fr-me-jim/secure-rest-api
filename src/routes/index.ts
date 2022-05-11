import passport, { PassportStatic } from 'passport';
import { Router } from "express";

// interfaces
import UserRepositories from 'src/repositories/User.repositories';

import PassportConfig from "../auth/passport";


const passportConfig = new PassportConfig(passport, new UserRepositories());
export const strategy = passportConfig.SetStrategy();

// middlewares
import { isTokenBlacklisted, isAdminUser } from '../middlewares/auth.middlewares';
export const middlewares = [ 
    strategy.authenticate('jwt', { session: false }), 
    isTokenBlacklisted 
];

// routes
import AuthRoutes from './Auth.routes';
import AdminRoutes from './Admin.routes';
import UserRoutes from './User.routes';



const router = Router();

router.use('/', AuthRoutes);
router.use('/users', ...middlewares, UserRoutes);
router.use('/admin', ...middlewares, isAdminUser, AdminRoutes);

export class Routes {
    private router: Router;
    protected strategy: PassportStatic;
    protected middlewares: { (): any }[]
    // protected strategy: PassportStatic;
    // protected PassportConfig: IPassportConfig;



    constructor( strategy: PassportStatic ) {
        this.router = Router();
        this.strategy = strategy;
        this.middlewares = middlewares;
        // this.PassportConfig = passportConfig;
        // this.strategy = this.PassportConfig.SetStrategy();
    };

    InitializeRouter() {
        this.router.use('/', AuthRoutes);
        this.router.use('/users', ...this.middlewares, UserRoutes);
        this.router.use('/admin', ...this.middlewares, isAdminUser, AdminRoutes);

        return this.router;
    }
}

export default router;
