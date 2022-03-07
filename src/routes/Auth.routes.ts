import { Router } from "express";
import { strategy } from '../routes/index';

import UserController from '../controllers/User.controller';

// router
const router = Router();

router.post("/signin", UserController.registerUser);
router.post("/login", strategy.authenticate('local', { session: false }), UserController.login);

export default router;