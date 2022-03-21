import { Router } from "express";
import { strategy } from '../routes/index';

import UserController from '../controllers/User.controller';

// router
const router = Router();

router.post("/signin", UserController.registerUser);
router.post("/login", strategy.authenticate('local', { session: false }), UserController.login);
router.get("/logout", strategy.authenticate('local', { session: false }), UserController.logout);

export default router;