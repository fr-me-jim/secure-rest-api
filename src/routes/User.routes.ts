import UserController from '../controllers/User.controller';

// router
import router, { strategy } from '../routes/index';

router.post("/signin", UserController.createUser);
router.post("/login", strategy.authenticate('local', { session: false }), UserController.login);