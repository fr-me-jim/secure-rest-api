import { Router } from "express";
import { RouterAPI } from ".";

// controllers
import AdminController from '../controllers/Admin.controller';

// repos
// import UserRepositories from "../repositories/User.repositories";

// router
// const router = Router();
// const controller = new AdminController(new UserRepositories());

// router.get("/users/show", controller.getAllUserInfo);
// router.get("/users/show/:id", controller.getUserInfo);

export default class AdminRouter extends RouterAPI {
    private adminController: AdminController;

    constructor() {
        super();

        this.adminController = new AdminController(this.UserRepository);
    };


    public readonly SetRoutes = (): Router => {
        this.router.get("/profile", this.adminController.getUserProfileInfo);
        this.router.put("/profile/edit", this.adminController.editProfileUser);

        return this.router;
    };
};
