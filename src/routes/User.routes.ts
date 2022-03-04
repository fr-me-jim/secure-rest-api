import UserController from '../controllers/User.controller';
import AdminController from '../controllers/Admin.controller';

// router
import router, { strategy } from '../routes/index';

router.post("/signin", UserController.registerUser);
router.post("/login", strategy.authenticate('local', { session: false }), UserController.login);

router.get("/users", strategy.authenticate('jwt', { session: false }), AdminController.getAllUserInfo);
router.get("/users/:id", strategy.authenticate('jwt', { session: false }), AdminController.getUserInfo);
router.get("/users/me", strategy.authenticate('jwt', { session: false }), UserController.getUserProfileInfo);