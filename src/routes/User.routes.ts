import { Router } from "express";

// controllers
import UserController from '../controllers/User.controller';

// router
const router = Router();

router.get("/profile", UserController.getUserProfileInfo);
router.post("/profile/edit", UserController.editProfileUser);

export default router;