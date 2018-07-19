import express from 'express';
import AuthService from '../services/auth.service';
import UserController from '../controllers/user.controller';
import classesController from '../controllers/classes.controller';
import URLS from '../lib/urls';

const userRoutes = express.Router();

userRoutes.use(URLS.home, AuthService.ensureAuthenticated);

userRoutes.post(URLS.home, UserController.getAllUsers);

userRoutes.post(URLS.getBatches, classesController.getBatches);

export default userRoutes;
