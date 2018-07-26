'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _triggerEmailVerification = require('../helpers/triggerEmailVerification');

var _triggerEmailVerification2 = _interopRequireDefault(_triggerEmailVerification);

var _emailVerification = require('../models/emailVerification.model');

var _emailVerification2 = _interopRequireDefault(_emailVerification);

var _studentInvite = require('../models/studentInvite.model');

var _studentInvite2 = _interopRequireDefault(_studentInvite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint no-underscore-dangle: 0 */
const signup = async (req, res) => {
  const newUser = new _user2.default({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    isInstructor: req.body.isInstructor
  });
  try {
    if (newUser.isInstructor === false) {
      const student = await _studentInvite2.default.findOne({ email: newUser.email });
      if (!student) {
        res.status(422);
        res.json({ error: "You've not been invited " });
        return;
      }
    }
    const savedUser = await newUser.save();
    await (0, _triggerEmailVerification2.default)(req, savedUser);
    console.log('User saved successfully');
    res.json({ success: 'user registration successful' });
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
    const emailVerify = await _emailVerification2.default.findOne({ token: req.params.token });
    if (!emailVerify) {
      res.status(400);
      res.json({
        type: 'not-verified',
        msg: 'We were unable to find a valid token. Your token may have expired.'
      });
      return;
    }
    const user = await _user2.default.findByIdAndUpdate(emailVerify._userId, { $set: { isVerified: true } }, { new: true });
    if (!user) {
      res.status(400);
      res.json({ type: 'not-verified', msg: 'We were unable to find user for this token.' });
    }
    if (user.isVerified) {
      res.json({ type: 'verified', msg: 'Email has been successfully verified' });
    }
  } catch (error) {
    res.status(500);
    res.send('oops, something went wrong');
  }
};

const resendToken = async (req, res) => {
  try {
    const user = await _user2.default.findOne({ email: req.body.email });
    if (!user) {
      res.status(400);
      res.json({
        success: false,
        message: 'email not registered'
      });
      return;
    }
    if (user.isVerified) {
      res.status(400);
      res.json({
        success: false,
        message: 'This account has already been verified. Please log in.'
      });
      return;
    }
    const isEmailSent = await (0, _triggerEmailVerification2.default)(req, user);
    if (isEmailSent) {
      res.json({
        success: true,
        message: 'Verification email has been sent to registered email'
      });
    }
  } catch (error) {
    res.status(500);
    res.send('oops, Something went wrong');
  }
};

exports.default = {
  signup,
  confirmation,
  resendToken
};