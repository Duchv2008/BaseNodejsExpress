import express, { Router } from 'express';
import passport from 'passport';
import controller from 'controllers/blacklist_accesstoken_controller';

const usingJWT = passport.authenticate('jwt', { session: false });
var router = Router();

router.get('/test', usingJWT, controller.create);

export default router;