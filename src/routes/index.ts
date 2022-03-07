// import passport from 'passport';
import { Router } from "express";

// import PassportConfig from "../auth/passport";

// routes
import authRoutes from './Auth.routes';
import userRoutes from './User.routes';

const router = Router();
// const passportConfig = new PassportConfig(passport);
// export const strategy = passportConfig.SetStrategy();

router.get('/', () => {
    console.log("hello")
});

router.use('/', authRoutes);
router.use('/users', userRoutes);

export default router;
