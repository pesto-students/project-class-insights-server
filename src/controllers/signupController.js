/* eslint no-underscore-dangle: 0 */
import mongoose from 'mongoose';

import UserModel from '../models/user.model';
import triggerEmailVerification from '../helpers/triggerEmailVerification';
import EmailVerify from '../models/emailVerification.model';
import StudentInvite from '../models/studentInvite.model';
import instructorController from './instructor.controller';
import CONSTANTS from '../lib/constants';
import studentsController from './students.controller';


const signup = async (req, res) => {
  const _id = new mongoose.Types.ObjectId();
  const {
    name, isInstructor, email, password,
  } = req.body;
  const newUser = new UserModel({
    _id,
    email,
    password,
    isInstructor,
  });
  try {
    if (newUser.isInstructor === false) {
      const student = await StudentInvite.findOne({ email: newUser.email });
      if (!student) {
        res.status(422);
        res.json({ error: "You've not been invited " });
        return;
      }
    }
    let savedUser;
    if (!isInstructor) {
      const user = await UserModel.findOne({ email }, {});
      // console.log(user._id);
      if (user) {
        const userId = user._id;
        studentsController.passTheStudentId(name, userId, req.body.email);
        res.json({ success: 'registration successful for another batch' });
      } else {
        savedUser = await newUser.save();
        studentsController.passTheStudentId(name, _id, req.body.email);
        await triggerEmailVerification(req, savedUser);
        res.json({ success: 'user registration successful' });
      }
    } else {
      savedUser = await newUser.save();
      instructorController.createInstructor(name, _id);
      await triggerEmailVerification(req, savedUser);
      res.json({ success: 'user registration successful' });
    // set depending on the flag isInstructor to be true or false, else create student
    }
    console.log('User saved successfully');
  } catch (error) {
    if (error.message.includes('11000')) {
      res.status(422);
      res.json({ error: 'email already registered' });
    }
    if (error.message.includes('is required')) {
      res.status(422);
      res.json({ error: 'All fields are required' });
    }
    if (error.message.includes('email: invalid email')) {
      res.status(422);
      res.json({ error: 'email is not valid' });
    }
    if (error.message.includes('shorter than the minimum allowed length')) {
      res.status(422);
      res.json({ error: 'Password should be minimum 8 characters long' });
    }
    console.log(error.message);
  }
};

const confirmation = async (req, res) => {
  try {
    const emailVerify = await EmailVerify.findOne({ token: req.params.token });
    if (!emailVerify) {
      res.status(400);
      res.json({
        type: 'not-verified',
        msg: 'We were unable to find a valid token. Your token may have expired.',
      });
      return;
    }
    const user = await UserModel.findByIdAndUpdate(
      emailVerify._userId,
      { $set: { isVerified: true } },
      { new: true },
    );
    if (!user) {
      res.status(400);
      res.json({ type: 'not-verified', msg: 'We were unable to find user for this token.' });
    }
    if (user.isVerified) {
      res.redirect(CONSTANTS.FRONTEND_URL);
    }
  } catch (error) {
    res.status(500);
    res.send('oops, something went wrong');
  }
};

const resendToken = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      res.status(400);
      res.json({
        success: false,
        message: 'email not registered',
      });
      return;
    }
    if (user.isVerified) {
      res.status(400);
      res.json({
        success: false,
        message: 'This account has already been verified. Please log in.',
      });
      return;
    }
    const isEmailSent = await triggerEmailVerification(req, user);
    if (isEmailSent) {
      res.json({
        success: true,
        message: 'Verification email has been sent to registered email',
      });
    }
  } catch (error) {
    res.status(500);
    res.send('oops, Something went wrong');
  }
};

export default {
  signup,
  confirmation,
  resendToken,
};

