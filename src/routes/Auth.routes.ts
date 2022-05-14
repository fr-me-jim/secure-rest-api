import { Router } from "express";
import { 
    // strategy, middlewares, 
    RouterAPI 
} from '../routes/index';

// controllers
import AuthController from "../controllers/Auth.controller";

// repositories
// import UserRepositories from '../repositories/User.repositories';
// import TokenRepositories from "../repositories/Token.repositories";

// router
// const router = Router();
// const controller = new AuthController(new UserRepositories(), new TokenRepositories());

// router.post("/signin", controller.registerUser);
// router.get("/logout", ...middlewares, controller.logout);
// router.post("/login", strategy.authenticate('local', { session: false }), controller.login);

export default class AuthRouter extends RouterAPI {
    private authController: AuthController;

    constructor() {
        super();

        this.authController = new AuthController(
            this.UserRepository, 
            this.TokenRepository
        );
    };

    public readonly SetRoutes = (): Router => {
        this.router.post("/signin", this.authController.registerUser);
        this.router.get("/logout", ...this.middlewares, this.authController.logout);
        this.router.post("/login", this.strategy.authenticate('local', { session: false }), this.authController.login);

        return this.router;
    };

};

// export default router;