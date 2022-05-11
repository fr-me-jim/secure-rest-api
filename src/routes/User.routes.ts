import { Router } from "express";

// controllers
import UserController from '../controllers/User.controller';

// repos
import UserRepositories from "src/repositories/User.repositories";

// router
const router = Router();

const controller = new UserController(new UserRepositories());

router.get("/profile", controller.getUserProfileInfo);
router.put("/profile/edit", controller.editProfileUser);

export default router;