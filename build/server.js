'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _asyncPolling = require('async-polling');

var _asyncPolling2 = _interopRequireDefault(_asyncPolling);

var _express3 = require('./config/express');

var _express4 = _interopRequireDefault(_express3);

var _constants = require('./lib/constants');

var _constants2 = _interopRequireDefault(_constants);

var _urls = require('./lib/urls');

var _urls2 = _interopRequireDefault(_urls);

var _userConstants = require('./lib/userConstants');

var _userConstants2 = _interopRequireDefault(_userConstants);

var _user = require('./models/user.model');

var _user2 = _interopRequireDefault(_user);

var _user3 = require('./routes/user.route');

var _user4 = _interopRequireDefault(_user3);

var _auth = require('./controllers/auth.controller');

var _auth2 = _interopRequireDefault(_auth);

var _signupController = require('./controllers/signupController');

var _signupController2 = _interopRequireDefault(_signupController);

var _getFromController = require('./controllers/getFromController');

var _getFromController2 = _interopRequireDefault(_getFromController);

var _batches = require('./controllers/batches.controller');

var _batches2 = _interopRequireDefault(_batches);

var _feedbacks = require('./controllers/feedbacks.controller');

var _feedbacks2 = _interopRequireDefault(_feedbacks);

var _students = require('./controllers/students.controller');

var _students2 = _interopRequireDefault(_students);

var _batchUpdater = require('./helpers/batchUpdater');

var _batchUpdater2 = _interopRequireDefault(_batchUpdater);

var _analyseFeedbacks = require('./helpers/analyseFeedbacks');

var _analyseFeedbacks2 = _interopRequireDefault(_analyseFeedbacks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Import required controllers

// Import all models
_dotenv2.default.config();

// Import all routes


const { DB_URI } = _constants2.default;

const app = (0, _express2.default)();
(0, _express4.default)(app);

_mongoose2.default.connect(DB_URI, { useNewUrlParser: true });

_mongoose2.default.connection.on('open', () => {
  console.log('Connected to mongo server.');
  // return start_up();
});

_mongoose2.default.connection.on('error', err => {
  console.log('Could not connect to mongo server!');
  return console.log(err);
});

app.use('/users', _user4.default);

app.get('/', (req, res) => res.send('Working!'));
app.get('/status', (req, res) => {
  res.json({ status: 'Server is up and running!' });
});

app.get('/setup', async (req, res) => {
  // create a sample user
  const John = new _user2.default({
    name: 'John Boy',
    email: 'johnboy@example.com',
    password: 'password'
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

const poll = (0, _asyncPolling2.default)(end => {
  _batchUpdater2.default.updateStudentCount();
  end();
}, _userConstants2.default.WAIT_TIME);
poll.on('error', () => {
  console.log('error in poll');
});

poll.run();

app.post(_urls2.default.login, _auth2.default.login);
app.post(_urls2.default.signup, _signupController2.default.signup);

app.get(`${_urls2.default.getFormById}/:id`, _getFromController2.default.getFormById);

app.get(`${_urls2.default.emailConfirmation}/:token`, _signupController2.default.confirmation);
app.post(_urls2.default.resendToken, _signupController2.default.resendToken);
app.get(_urls2.default.getLatestForm, _getFromController2.default.getLatestForm);
app.get(_urls2.default.batches, _batches2.default.getBatchesMain);

app.get(_urls2.default.feedbacks, _feedbacks2.default.getBatchesFeedback);
app.patch(`${_urls2.default.batches}/:id`, _batches2.default.editBatch);
app.delete(_urls2.default.batches, _batches2.default.deleteBatch);

app.get(`${_urls2.default.students}/:id`, _students2.default.getStudents);

app.get('/test', _analyseFeedbacks2.default.setInitialResults);

exports.default = app;