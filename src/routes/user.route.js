import express from 'express';
import AuthService from '../services/auth.service';
import UserController from '../controllers/user.controller';

const userRoutes = express.Router();

userRoutes.use('/', AuthService.ensureAuthenticated);

userRoutes.get('/', UserController.getAllUsers);

export default userRoutes;
