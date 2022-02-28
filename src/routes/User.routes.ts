import UserController from 'src/controllers/User.controller';

// router
import router, { strategy } from 'src/routes/index';

router.post("/signin", UserController.createUser);
router.post("/login", strategy.authenticate('local', { session: false }), UserController.login);