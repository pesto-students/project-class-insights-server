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

var _express3 = require('./config/express');

var _express4 = _interopRequireDefault(_express3);

var _constants = require('./lib/constants');

var _constants2 = _interopRequireDefault(_constants);

var _urls = require('./lib/urls');

var _urls2 = _interopRequireDefault(_urls);

var _user = require('./models/user.model');

var _user2 = _interopRequireDefault(_user);

var _user3 = require('./routes/user.route');

var _user4 = _interopRequireDefault(_user3);

var _auth = require('./controllers/auth.controller');

var _auth2 = _interopRequireDefault(_auth);

var _signupController = require('./controllers/signupController');

var _signupController2 = _interopRequireDefault(_signupController);

var _submitformController = require('./controllers/submitformController');

var _submitformController2 = _interopRequireDefault(_submitformController);

var _submitfeedbackController = require('./controllers/submitfeedbackController');

var _submitfeedbackController2 = _interopRequireDefault(_submitfeedbackController);

var _getFromController = require('./controllers/getFromController');

var _getFromController2 = _interopRequireDefault(_getFromController);

var _classes = require('./controllers/classes.controller');

var _classes2 = _interopRequireDefault(_classes);

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

app.post(_urls2.default.login, _auth2.default.login);
app.post(_urls2.default.signup, _signupController2.default.signup);
app.post(_urls2.default.submitform, _submitformController2.default.submit);
app.post(_urls2.default.submitfeedback, _submitfeedbackController2.default.submitfeedback);
app.get(`${_urls2.default.getFormById}/:id`, _getFromController2.default.getFormById);
app.get(_urls2.default.getForm, _getFromController2.default.getForm);
app.get(_urls2.default.allClassesFeedback, _classes2.default.getClassesFeedback);
app.get(_urls2.default.anyDayFeedback, _classes2.default.getThisDayClassFeedback);
app.get(`${_urls2.default.emailConfirmation}/:token`, _signupController2.default.confirmation);
app.post(_urls2.default.resendToken, _signupController2.default.resendToken);
app.get(_urls2.default.getLatestForm, _getFromController2.default.getLatestForm);

exports.default = app;