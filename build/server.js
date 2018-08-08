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

var _user = require('./routes/user.route');

var _user2 = _interopRequireDefault(_user);

var _auth = require('./controllers/auth.controller');

var _auth2 = _interopRequireDefault(_auth);

var _signupController = require('./controllers/signupController');

var _signupController2 = _interopRequireDefault(_signupController);

var _batchUpdater = require('./helpers/batchUpdater');

var _batchUpdater2 = _interopRequireDefault(_batchUpdater);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */
_dotenv2.default.config();

// Import required controllers


const { DB_URI } = _constants2.default;

const app = (0, _express2.default)();
(0, _express4.default)(app);

_mongoose2.default.connect(DB_URI, { useNewUrlParser: true });

_mongoose2.default.connection.on('open', () => {
  console.log('Connected to mongo server.');
});

_mongoose2.default.connection.on('error', err => {
  console.log('Could not connect to mongo server!');
  return err;
});

const poll = (0, _asyncPolling2.default)(end => {
  _batchUpdater2.default.updateStudentCount();
  end();
}, _userConstants2.default.WAIT_TIME);

poll.on('error', () => {
  console.log('error in poll');
});

poll.run();

app.use('/users', _user2.default);

app.get('/', (_, res) => res.send('Working!'));
app.get('/status', (_, res) => {
  res.json({ status: 'Server is up and running!' });
});

app.get(`${_urls2.default.emailConfirmation}/:token`, _signupController2.default.confirmation);

app.post(_urls2.default.resendToken, _signupController2.default.resendToken);
app.post(_urls2.default.login, _auth2.default.login);
app.post(_urls2.default.signup, _signupController2.default.signup);

exports.default = app;