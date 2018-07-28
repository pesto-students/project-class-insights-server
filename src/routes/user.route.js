import express from 'express';
import AuthService from '../services/auth.service';
import UserController from '../controllers/user.controller';
import URLS from '../lib/urls';
import submitformController from '../controllers/submitformController';
import getFormController from '../controllers/getFromController';
import submitfeedbackController from '../controllers/submitfeedbackController';
import batchesController from '../controllers/batches.controller';
import studentController from '../controllers/students.controller';
import dashboardController from '../controllers/dashboard.controller';

const userRoutes = express.Router();

userRoutes.use(URLS.home, AuthService.ensureAuthenticated);

userRoutes.post(URLS.home, UserController.getAllUsers);

userRoutes.post(URLS.submitform, submitformController.submit);

userRoutes.get(URLS.getForm, getFormController.getForm);
userRoutes.post(URLS.submitfeedback, submitfeedbackController.submitfeedback);
userRoutes.get(URLS.batches, batchesController.getBatchesMain);
userRoutes.post(URLS.batches, batchesController.createBatch);
userRoutes.post(URLS.students, studentController.createStudent);
userRoutes.get('/test', dashboardController.getResults);

export default userRoutes;
