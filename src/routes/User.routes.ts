import { Router } from "express";
import { RouterAPI } from ".";

// controllers
import UserController from '../controllers/User.controller';

// repos
// import UserRepositories from "../repositories/User.repositories";

// router
// const router = Router();

// const controller = new UserController(new UserRepositories());

// router.get("/profile", controller.getUserProfileInfo);
// router.put("/profile/edit", controller.editProfileUser);

export default class UserRouter extends RouterAPI {
    private userController: UserController;

    constructor() {
        super();

        this.userController = new UserController(this.UserRepository);
    };


    public readonly SetRoutes = (): Router => {
        this.router.get("/profile", this.userController.getUserProfileInfo);
        this.router.put("/profile/edit", this.userController.editProfileUser);

        return this.router;
    };
};

// export default router;