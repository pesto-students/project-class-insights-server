'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _auth = require('../services/auth.service');

var _auth2 = _interopRequireDefault(_auth);

var _user = require('../controllers/user.controller');

var _user2 = _interopRequireDefault(_user);

var _urls = require('../lib/urls');

var _urls2 = _interopRequireDefault(_urls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const userRoutes = _express2.default.Router();

userRoutes.use(_urls2.default.home, _auth2.default.ensureAuthenticated);

userRoutes.post(_urls2.default.home, _user2.default.getAllUsers);

exports.default = userRoutes;