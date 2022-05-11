import { Router } from "express";
import { strategy, middlewares } from '../routes/index';

// controllers
import AuthController from "src/controllers/Auth.controller";

// repositories
import UserRepositories from '../repositories/User.repositories';
import TokenRepositories from "src/repositories/Token.repositories";

// router
const router = Router();
const controller = new AuthController(new UserRepositories(), new TokenRepositories());

router.post("/signin", controller.registerUser);
router.get("/logout", ...middlewares, controller.logout);
router.post("/login", strategy.authenticate('local', { session: false }), controller.login);

export default router;