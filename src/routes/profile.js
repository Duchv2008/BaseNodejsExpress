import { Router } from 'express';
import passport from 'passport';
import controller from 'controllers/profile_controller.js';
var router = Router();
const usingJWT = passport.authenticate('jwt', { session: false });

router.put('/', usingJWT, controller.update);
router.get('/:user_id', usingJWT, controller.show);

export default router;