'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _emailVerification = require('../models/emailVerification.model');

var _emailVerification2 = _interopRequireDefault(_emailVerification);

var _sendMail = require('../helpers/sendMail');

var _sendMail2 = _interopRequireDefault(_sendMail);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const triggerEmailVerification = async (req, savedUser) => {
  const newToken = new _emailVerification2.default({ _userId: savedUser._id, token: _crypto2.default.randomBytes(16).toString('hex') });
  const savedToken = await newToken.save();
  const { email } = savedUser;
  const { token } = savedToken;
  _sendMail2.default.sendVerificationMail(req, email, token);
}; /* eslint no-underscore-dangle: 0 */
exports.default = triggerEmailVerification;