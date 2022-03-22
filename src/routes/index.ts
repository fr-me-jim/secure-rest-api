import passport from 'passport';
import { Router } from "express";

import PassportConfig from "../auth/passport";

const passportConfig = new PassportConfig(passport);
export const strategy = passportConfig.SetStrategy();

// routes
import AuthRoutes from './Auth.routes';
import AdminRoutes from './Admin.routes';
import UserRoutes from './User.routes';

// middlewares
import { isTokenBlacklisted } from '../middlewares/auth.middlewares';

const middlewares = [ strategy.authenticate('jwt', { session: false }), isTokenBlacklisted ];

const router = Router();

router.use('/', AuthRoutes);
router.use('/users', ...middlewares, UserRoutes);
router.use('/admin', ...middlewares, AdminRoutes);

export default router;
