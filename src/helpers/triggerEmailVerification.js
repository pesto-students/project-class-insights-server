/* eslint no-underscore-dangle: 0 */
import crypto from 'crypto';
import nodemailer from 'nodemailer';

import EmailVerify from '../models/emailVerification.model';

import CONSTANTS from '../lib/constants';

const triggerEmailVerification = async (req, savedUser) => {
  const token = new EmailVerify({ _userId: savedUser._id, token: crypto.randomBytes(16).toString('hex') });
  const savedToken = await token.save();
  const transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: CONSTANTS.SENDGRID_USER, pass: CONSTANTS.SENDGRID_APIKEY } });
  const mailOptions = {
    from: 'no-reply@classinsights.io',
    to: savedUser.email,
    subject: 'Account Verification Token',
    text: `${'Hello,\n\n Please verify your account by clicking the link: \n http://'}${req.headers.host}/confirmation/${savedToken.token}.\n`,
  };
  const sendmail = await transporter.sendMail(mailOptions);
  if (sendmail.accepted) {
    return true;
  }
  return false;
};

export default triggerEmailVerification;
