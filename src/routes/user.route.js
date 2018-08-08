import express from 'express';
import AuthService from '../services/auth.service';
import URLS from '../lib/urls';
import submitformController from '../controllers/submitformController';
import getFormController from '../controllers/getFromController';
import submitfeedbackController from '../controllers/submitfeedbackController';
import batchesController from '../controllers/batches.controller';
import studentController from '../controllers/students.controller';
import dashboardController from '../controllers/dashboard.controller';
import feedbacksController from '../controllers/feedbacks.controller';

const userRoutes = express.Router();

userRoutes.use(URLS.home, AuthService.ensureAuthenticated);

userRoutes.get(URLS.getForm, getFormController.getForm);
userRoutes.get(URLS.batches, batchesController.getBatchesMain);
userRoutes.get(URLS.dashboard, dashboardController.getResults);
userRoutes.get(`${URLS.getFormById}/:id`, getFormController.getFormById);
userRoutes.get(`${URLS.students}/:id`, studentController.getStudents);

userRoutes.post(URLS.batches, batchesController.createBatch);
userRoutes.post(URLS.submitfeedback, submitfeedbackController.submitfeedback);
userRoutes.post(URLS.submitform, submitformController.createForm);
userRoutes.post(URLS.students, studentController.createStudent);

userRoutes.patch(URLS.batches, batchesController.editBatch);
userRoutes.patch(URLS.feedbacks, feedbacksController.setStatusOfFeedback);

userRoutes.delete(URLS.batches, batchesController.deleteBatch);

export default userRoutes;
