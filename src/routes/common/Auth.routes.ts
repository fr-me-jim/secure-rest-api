import { Router, Request, Response } from "express";

// main RouterAPI
import RouterAPI from "../";

// controllers
import AuthController from "../../controllers/Auth.controller";

export default class AuthRouter {
    private router: Router;
    private routerAPI: RouterAPI;
    private authController: AuthController;

    constructor(routerAPI: RouterAPI) {
        this.router = Router();
        this.routerAPI = routerAPI;
        this.authController = new AuthController(
            routerAPI.UserRepository, 
            routerAPI.TokenRepository
        );
    };

    public readonly SetRoutes = (): Router => {
        this.router.get('/csrf', (req: Request, res: Response) => {
            res.cookie('XSRF-TOKEN', req.csrfToken()).end();
        });
        this.router.post("/signin", this.routerAPI.middlewares[0], this.authController.registerUser);
        this.router.get("/logout", ...this.routerAPI.middlewares, this.authController.logout);
        this.router.post("/login", this.routerAPI.middlewares[0], this.routerAPI.strategy.authenticate('local', { session: false }), this.authController.login);

        return this.router;
    };

};
