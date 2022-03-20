import passport from 'passport';
import { Router } from "express";

import PassportConfig from "../auth/passport";

const passportConfig = new PassportConfig(passport);
export const strategy = passportConfig.SetStrategy();

// routes
import authRoutes from './Auth.routes';
import userRoutes from './User.routes';

const middleware = [ strategy.authenticate('jwt', { session: false }) ];

const router = Router();

router.use('/', authRoutes);
router.use('/users', ...middleware, userRoutes);

export default router;
