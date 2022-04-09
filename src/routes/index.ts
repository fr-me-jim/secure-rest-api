import passport from 'passport';
import { Router } from "express";

import PassportConfig from "../auth/passport";

const passportConfig = new PassportConfig(passport);
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

export default router;
