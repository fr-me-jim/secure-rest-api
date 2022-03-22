import { Router } from "express";

// controllers
import AuthController from '../controllers/Auth.controller';
import AdminController from '../controllers/Admin.controller';

// router
const router = Router();

router.get("/users/show", AuthController.checkAdminPermissions, AdminController.getAllUserInfo);
router.get("/users/show/:id", AuthController.checkAdminPermissions, AdminController.getUserInfo);

export default router;