/* eslint no-underscore-dangle: 0 */
import jwt from 'jsonwebtoken';

import StudentInvite from '../models/studentInvite.model';
import sendMail from '../helpers/sendMail';

import CONSTANTS from '../lib/constants';

const triggerStudentInvite = async (savedStudent) => {
  const { email, batchId } = savedStudent;

  const payload = {
    email,
    batchId,
  };

  const token = jwt.sign(payload, CONSTANTS.JWT_ENCRYPTION, {});

  const newInvite = new StudentInvite({
    email,
    batchId,
    token,
  });

  await newInvite.save();

  sendMail.sendInviteMail(email, token);
};

export default triggerStudentInvite;
