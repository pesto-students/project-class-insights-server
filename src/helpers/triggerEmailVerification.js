/* eslint no-underscore-dangle: 0 */
import crypto from 'crypto';

import EmailVerify from '../models/emailVerification.model';
import sendMail from '../helpers/sendMail';

const triggerEmailVerification = async (req, savedUser) => {
  const newToken = new EmailVerify({ _userId: savedUser._id, token: crypto.randomBytes(16).toString('hex') });
  const savedToken = await newToken.save();
  const { email } = savedUser;
  const { token } = savedToken;
  sendMail.sendVerificationMail(req, email, token);
};

export default triggerEmailVerification;
