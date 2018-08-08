import nodemailer from 'nodemailer';

import CONSTANTS from '../lib/constants';

const createTransportor = () => (nodemailer.createTransport({ service: 'Sendgrid', auth: { user: CONSTANTS.SENDGRID_USER, pass: CONSTANTS.SENDGRID_APIKEY } }));

const sendInviteMail = async (email, token) => {
  const transporter = createTransportor();

  const mailOptions = {
    from: 'no-reply@classinsights.io',
    to: email,
    subject: 'You have been invited',
    text: `${'Hello,\n\n Please verify your account by clicking the link: \n '}${CONSTANTS.FRONTEND_URL}${'/registerStudent?token='}${token}.\n`,
  };

  await transporter.sendMail(mailOptions);
};

const sendVerificationMail = async (req, email, token) => {
  const transporter = createTransportor();

  const mailOptions = {
    from: 'no-reply@classinsights.io',
    to: email,
    subject: 'Account Verification Token',
    text: `${'Hello,\n\n Please verify your account by clicking the link: \n http://'}${req.headers.host}/confirmation/${token}.\n`,
  };

  await transporter.sendMail(mailOptions);
};

export default {
  sendInviteMail,
  sendVerificationMail,
};
