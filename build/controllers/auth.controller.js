'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _constants = require('../lib/constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const login = async (req, res) => {
  try {
    const user = await _user2.default.findOne({ email: req.body.email });

    // user not found
    if (!user) {
      res.json({
        success: false,
        message: 'Authentication failed. User not found.'
      });
      return;
    }

    if (!user.isVerified) {
      res.status(401);
      res.json({ success: false, message: 'Your account has not been verified.' });
      return;
    }
    // check if correct password
    _bcrypt2.default.compare(req.body.password, user.password, (err, loginsuccess) => {
      if (!loginsuccess) {
        res.json({
          success: false,
          message: 'Authentication failed. Wrong password.'
        });
      } else {
        // correct password, create token
        const payload = {
          email: user.email,
          isInstructor: user.isInstructor
        };
        const token = _jsonwebtoken2.default.sign(payload, _constants2.default.JWT_ENCRYPTION, {
          expiresIn: _constants2.default.JWT_EXPIRATION // expires in 12 hours
        });
        res.json({
          success: true,
          message: 'User Authenticated',
          token
        });
      }
    });
  } catch (e) {
    console.log(e);
  }
};

exports.default = {
  login
};