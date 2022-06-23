import { Router } from "express";

// main RouterAPI
import RouterAPI from "../";

// controllers
import SuperAdminController from '../../controllers/SuperAdmin.controller';

export default class SuperAdminRouter {
    private router: Router;

    private routerAPI: RouterAPI;
    private adminController: SuperAdminController;

    constructor(routerAPI: RouterAPI) {
        this.router = Router();

        this.routerAPI = routerAPI;
        this.adminController = new SuperAdminController(this.routerAPI.UserRepository);
    };


    public readonly SetRoutes = (): Router => {
        this.router.get("/", this.adminController.getAllUsersInfo);
        this.router.get("/:id", this.adminController.getUserInfo);
        this.router.put("/:id", this.adminController.editProfileUser);
        this.router.delete("/:id", this.adminController.deleteUser);

        return this.router;
    };
};
