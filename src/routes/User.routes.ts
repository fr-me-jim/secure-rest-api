import { Router } from "express";

// controllers
import AuthController from '../controllers/Auth.controller';
import UserController from '../controllers/User.controller';
import AdminController from '../controllers/Admin.controller';

// router
const router = Router();

router.get("/show", AuthController.checkAdminPermissions, AdminController.getAllUserInfo);
router.get("/show/:id", AuthController.checkAdminPermissions, AdminController.getUserInfo);

router.get("/profile", UserController.getUserProfileInfo);
router.post("/profile/edit", UserController.editProfileUser);

export default router;