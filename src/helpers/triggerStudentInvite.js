/* eslint no-underscore-dangle: 0 */
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import StudentInvite from '../models/studentInvite.model';

import CONSTANTS from '../lib/constants';

const triggerStudentInvite = async (savedStudent) => {
  const payload = {
    email: savedStudent.email,
    batchId: savedStudent.batchId,
  };
  const token = jwt.sign(payload, CONSTANTS.JWT_ENCRYPTION, {
  });
  const newInvite = new StudentInvite({
    email: savedStudent.email,
    batchId: savedStudent.batchId,
    token,
  });
  await newInvite.save();


  const transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: CONSTANTS.SENDGRID_USER, pass: CONSTANTS.SENDGRID_APIKEY } });
  const mailOptions = {
    from: 'no-reply@classinsights.io',
    to: savedStudent.email,
    subject: 'You have been invited',
    text: `${'Hello,\n\n Please verify your account by clicking the link: \n '}${CONSTANTS.FRONTEND_URL}${'/registerStudent?token='}${token}.\n`,
  };
  const sendmail = await transporter.sendMail(mailOptions);
  if (sendmail.accepted) {
    return true;
  }
  return false;
};

export default triggerStudentInvite;
