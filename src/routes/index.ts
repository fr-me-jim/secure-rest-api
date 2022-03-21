import passport from 'passport';
import { Router } from "express";

import PassportConfig from "../auth/passport";

const passportConfig = new PassportConfig(passport);
export const strategy = passportConfig.SetStrategy();

// routes
import authRoutes from './Auth.routes';
import userRoutes from './User.routes';

// middlewares
import { isTokenBlacklisted } from '../middlewares/auth.middlewares';

const middlewares = [ strategy.authenticate('jwt', { session: false }), isTokenBlacklisted ];

const router = Router();

router.use('/', authRoutes);
router.use('/users', ...middlewares, userRoutes);

export default router;
