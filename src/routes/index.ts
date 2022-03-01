import passport from 'passport';
import { Router } from "express";

import PassportConfig from "../auth/passport";

const router = Router();
const passportConfig = new PassportConfig(passport);
export const strategy = passportConfig.SetStrategy();

router.get('/', () => {
    console.log("hello")
});

export default router;
