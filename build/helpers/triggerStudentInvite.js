'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _studentInvite = require('../models/studentInvite.model');

var _studentInvite2 = _interopRequireDefault(_studentInvite);

var _constants = require('../lib/constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint no-underscore-dangle: 0 */
const triggerStudentInvite = async savedStudent => {
  const payload = {
    email: savedStudent.email,
    batchId: savedStudent.batchId
  };
  const token = _jsonwebtoken2.default.sign(payload, _constants2.default.JWT_ENCRYPTION, {});
  const newInvite = new _studentInvite2.default({
    email: savedStudent.email,
    batchId: savedStudent.batchId,
    token
  });
  await newInvite.save();

  const transporter = _nodemailer2.default.createTransport({ service: 'Sendgrid', auth: { user: _constants2.default.SENDGRID_USER, pass: _constants2.default.SENDGRID_APIKEY } });
  const mailOptions = {
    from: 'no-reply@classinsights.io',
    to: savedStudent.email,
    subject: 'You have been invited',
    text: `${'Hello,\n\n Please verify your account by clicking the link: \n '}${_constants2.default.FRONTEND_URL}${'/registerStudent?token='}${token}.\n`
  };
  const sendmail = await transporter.sendMail(mailOptions);
  if (sendmail.accepted) {
    return true;
  }
  return false;
};

exports.default = triggerStudentInvite;