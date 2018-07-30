
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import AsyncPolling from 'async-polling';

import config from './config/express';


import CONSTANTS from './lib/constants';
import URLS from './lib/urls';
import userConstants from './lib/userConstants';
// Import all models
import UserModel from './models/user.model';

// Import all routes
import userRoutes from './routes/user.route';

// Import required controllers
import AuthController from './controllers/auth.controller';
import signupController from './controllers/signupController';
import getFormController from './controllers/getFromController';
import batchesController from './controllers/batches.controller';
import feedbacksController from './controllers/feedbacks.controller';
import studentController from './controllers/students.controller';
import batchUpdater from './helpers/batchUpdater';
import analyseFeedbacks from './helpers/analyseFeedbacks';

dotenv.config();

const { DB_URI } = CONSTANTS;

const app = express();
config(app);

mongoose.connect(
  DB_URI,
  { useNewUrlParser: true },
);

mongoose.connection.on('open', () => {
  console.log('Connected to mongo server.');
  // return start_up();
});

mongoose.connection.on('error', (err) => {
  console.log('Could not connect to mongo server!');
  return console.log(err);
});

app.use('/users', userRoutes);

app.get('/', (req, res) => res.send('Working!'));
app.get('/status', (req, res) => {
  res.json({ status: 'Server is up and running!' });
});

app.get('/setup', async (req, res) => {
  // create a sample user
  const John = new UserModel({
    name: 'John Boy',
    email: 'johnboy@example.com',
    password: 'password',
  });

  // save the sample user
  try {
    await John.save();
    console.log('User saved successfully');
    res.json({ success: true });
  } catch (error) {
    console.log(error);
  }
});

const poll = AsyncPolling((end) => {
  batchUpdater.updateStudentCount();
  end();
}, userConstants.WAIT_TIME);
poll.on('error', () => { console.log('error in poll'); });

poll.run();

app.post(URLS.login, AuthController.login);
app.post(URLS.signup, signupController.signup);


app.get(`${URLS.getFormById}/:id`, getFormController.getFormById);

app.get(`${URLS.emailConfirmation}/:token`, signupController.confirmation);
app.post(URLS.resendToken, signupController.resendToken);
app.get(URLS.getLatestForm, getFormController.getLatestForm);

app.get(URLS.feedbacks, feedbacksController.getBatchesFeedback);
app.patch(`${URLS.batches}/:id`, batchesController.editBatch);
app.delete(URLS.batches, batchesController.deleteBatch);


app.get(`${URLS.students}/:id`, studentController.getStudents);

app.get('/test', analyseFeedbacks.setInitialResults);

export default app;
