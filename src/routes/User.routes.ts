import { Router } from "express";

// main RouterAPI
import RouterAPI from ".";

// controllers
import UserController from '../controllers/User.controller';

export default class UserRouter {
    private router: Router;
    // private routerAPI: RouterAPI;
    private userController: UserController;

    constructor(routerAPI: RouterAPI) {
        this.router = Router();

        // this.routerAPI = routerAPI;
        this.userController = new UserController(routerAPI.UserRepository);
    };


    public readonly SetRoutes = (): Router => {
        this.router.get("/profile", this.userController.getUserProfileInfo);
        this.router.put("/profile/edit", this.userController.editProfileUser);
        this.router.put("/profile/edit/password", this.userController.editPasswordUser);

        return this.router;
    };
};