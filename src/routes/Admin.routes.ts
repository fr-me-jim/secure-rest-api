import { Router } from "express";

// controllers
import AdminController from '../controllers/Admin.controller';

// repos
import UserRepositories from "src/repositories/User.repositories";

// router
const router = Router();
const controller = new AdminController(new UserRepositories());
router.get("/users/show", controller.getAllUserInfo);
router.get("/users/show/:id", controller.getUserInfo);

export default router;