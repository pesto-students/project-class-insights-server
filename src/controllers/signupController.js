/* eslint no-underscore-dangle: 0 */
import UserModel from '../models/user.model';
import triggerEmailVerification from '../helpers/triggerEmailVerification';
import EmailVerify from '../models/emailVerification.model';


const signup = async (req, res) => {
  const newUser = new UserModel({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const savedUser = await newUser.save();
    await triggerEmailVerification(req, savedUser);
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
    const emailVerify = await EmailVerify.findOne({ token: req.params.token });
    if (!emailVerify) {
      res.status(400);
      res.json({
        type: 'not-verified',
        msg: 'We were unable to find a valid token. Your token may have expired.',
      });
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
      res.json({ type: 'verified', msg: 'Email has been successfully verified' });
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

