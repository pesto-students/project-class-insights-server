
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import config from './config/express';


import CONSTANTS from './lib/constants';
// Import all models
import UserModel from './models/user.model';

// Import all routes
import userRoutes from './routes/user.route';

// Import required controllers
import AuthController from './controllers/auth.controller';

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

app.post('/login', AuthController.login);

export default app;
