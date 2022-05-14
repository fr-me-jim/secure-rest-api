import { Router } from "express";

// main RouterAPI
import RouterAPI from ".";

// controllers
import AdminController from '../controllers/Admin.controller';

export default class AdminRouter {
    private router: Router;

    private routerAPI: RouterAPI;
    private adminController: AdminController;

    constructor(routerAPI: RouterAPI) {
        this.router = Router();

        this.routerAPI = routerAPI;
        this.adminController = new AdminController(this.routerAPI.UserRepository);
    };


    public readonly SetRoutes = (): Router => {
        this.router.get("/profile", this.adminController.getUserProfileInfo);
        this.router.put("/profile/edit", this.adminController.editProfileUser);

        return this.router;
    };
};
