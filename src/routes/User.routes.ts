import { Router } from "express";
import { strategy } from '../routes/index';

// controllers
import UserController from '../controllers/User.controller';
import AdminController from '../controllers/Admin.controller';

// router
const router = Router();

router.get("/", strategy.authenticate('jwt', { session: false }), AdminController.getAllUserInfo);
router.get("/show/:id", strategy.authenticate('jwt', { session: false }), AdminController.getUserInfo);
router.get("/profile", strategy.authenticate('jwt', { session: false }), UserController.getUserProfileInfo);
router.post("/edit/profile", strategy.authenticate('jwt', { session: false }), UserController.editProfileUser);

export default router;