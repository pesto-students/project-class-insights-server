'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _constants = require('../lib/constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createTransportor = () => _nodemailer2.default.createTransport({ service: 'Sendgrid', auth: { user: _constants2.default.SENDGRID_USER, pass: _constants2.default.SENDGRID_APIKEY } });

const sendInviteMail = async (email, token) => {
  const transporter = createTransportor();

  const mailOptions = {
    from: 'no-reply@classinsights.io',
    to: email,
    subject: 'You have been invited',
    text: `${'Hello,\n\n Please verify your account by clicking the link: \n '}${_constants2.default.FRONTEND_URL}${'/registerStudent?token='}${token}.\n`
  };

  await transporter.sendMail(mailOptions);
};

const sendVerificationMail = async (req, email, token) => {
  const transporter = createTransportor();

  const mailOptions = {
    from: 'no-reply@classinsights.io',
    to: email,
    subject: 'Account Verification Token',
    text: `${'Hello,\n\n Please verify your account by clicking the link: \n http://'}${req.headers.host}/confirmation/${token}.\n`
  };

  await transporter.sendMail(mailOptions);
};

exports.default = {
  sendInviteMail,
  sendVerificationMail
};