import passport from 'passport';
import { Router } from "express";

import PassportConfig from "../auth/passport";

import userRoutes from './User.routes';

const router = Router();
const passportConfig = new PassportConfig(passport);
export const strategy = passportConfig.SetStrategy();

router.get('/', () => {
    console.log("hello")
});

router.use('/', userRoutes);

export default router;
