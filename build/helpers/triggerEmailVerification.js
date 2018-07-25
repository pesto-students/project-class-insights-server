'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _emailVerification = require('../models/emailVerification.model');

var _emailVerification2 = _interopRequireDefault(_emailVerification);

var _constants = require('../lib/constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint no-underscore-dangle: 0 */
const triggerEmailVerification = async (req, savedUser) => {
  const token = new _emailVerification2.default({ _userId: savedUser._id, token: _crypto2.default.randomBytes(16).toString('hex') });
  const savedToken = await token.save();
  const transporter = _nodemailer2.default.createTransport({ service: 'Sendgrid', auth: { user: _constants2.default.SENDGRID_USER, pass: _constants2.default.SENDGRID_APIKEY } });
  const mailOptions = {
    from: 'no-reply@classinsights.io',
    to: savedUser.email,
    subject: 'Account Verification Token',
    text: `${'Hello,\n\n Please verify your account by clicking the link: \n http://'}${req.headers.host}/confirmation/${savedToken.token}.\n`
  };
  const sendmail = await transporter.sendMail(mailOptions);
  if (sendmail.accepted) {
    return true;
  }
  return false;
};

exports.default = triggerEmailVerification;