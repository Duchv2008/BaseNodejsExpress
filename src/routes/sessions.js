import express, { Router } from 'express';
import controller from 'controllers/session_controller';
var router = Router();

router.post('/login', controller.create);
router.post('/refresh_token', controller.refreshToken);
router.delete('/logout', controller.destroy);

export default router;