import express from 'express';
import AuthService from '../services/auth.service';
import UserController from '../controllers/user.controller';
import URLS from '../lib/urls';

const userRoutes = express.Router();

userRoutes.use(URLS.home, AuthService.ensureAuthenticated);

userRoutes.post(URLS.home, UserController.getAllUsers);


export default userRoutes;
