import { Router } from "express";
import { strategy } from '../routes/index';

// controllers
import AuthController from '../controllers/Auth.controller';
import UserController from '../controllers/User.controller';
import AdminController from '../controllers/Admin.controller';

// router
const router = Router();

router.get("/show", strategy.authenticate('jwt', { session: false }), AuthController.checkAdminPermissions, AdminController.getAllUserInfo);
router.get("/show/:id", strategy.authenticate('jwt', { session: false }), AdminController.getUserInfo);

router.get("/profile", AuthController.checkNonAdminPermissions, UserController.getUserProfileInfo);
router.post("/profile/edit", AuthController.checkNonAdminPermissions, UserController.editProfileUser);

export default router;