import passport from 'passport';
import { Router } from "express";

import PassportConfig from "../auth/passport";

const passportConfig = new PassportConfig(passport);
export const strategy = passportConfig.SetStrategy();

// routes
import authRoutes from './Auth.routes';
import userRoutes from './User.routes';

const router = Router();


router.use('/', authRoutes);
router.use('/users', userRoutes);

export default router;
