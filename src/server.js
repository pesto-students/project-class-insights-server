/* eslint-disable no-console */
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import AsyncPolling from 'async-polling';

import config from './config/express';

import CONSTANTS from './lib/constants';
import URLS from './lib/urls';
import userConstants from './lib/userConstants';
import userRoutes from './routes/user.route';

// Import required controllers
import AuthController from './controllers/auth.controller';
import signupController from './controllers/signupController';
import batchUpdater from './helpers/batchUpdater';

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
});

mongoose.connection.on('error', (err) => {
  console.log('Could not connect to mongo server!');
  return err;
});

const poll = AsyncPolling((end) => {
  batchUpdater.updateStudentCount();
  end();
}, userConstants.WAIT_TIME);

poll.on('error', () => { console.log('error in poll'); });

poll.run();

app.use('/users', userRoutes);

app.get('/', (_, res) => res.send('Working!'));
app.get('/status', (_, res) => {
  res.json({ status: 'Server is up and running!' });
});

app.get(`${URLS.emailConfirmation}/:token`, signupController.confirmation);

app.post(URLS.resendToken, signupController.resendToken);
app.post(URLS.login, AuthController.login);
app.post(URLS.signup, signupController.signup);


export default app;
