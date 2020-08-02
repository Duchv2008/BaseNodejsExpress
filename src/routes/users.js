import { Router } from 'express';
import controller from 'controllers/users_controller';
var router = Router();

router.post('/', controller.create);

export default router;
