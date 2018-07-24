import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/user.model';

import CONSTANTS from '../lib/constants';

const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    // user not found
    if (!user) {
      res.json({
        success: false,
        message: 'Authentication failed. User not found.',
      });
      return;
    }

    if (!user.isVerified) {
      res.status(401);
      res.json({ type: 'not-verified', msg: 'Your account has not been verified.' });
      return;
    }
    // check if correct password
    bcrypt.compare(req.body.password, user.password, (err, loginsuccess) => {
      if (!loginsuccess) {
        res.json({
          success: false,
          message: 'Authentication failed. Wrong password.',
        });
      } else {
        // correct password, create token
        const payload = { email: req.body.email };
        const token = jwt.sign(payload, CONSTANTS.JWT_ENCRYPTION, {
          expiresIn: CONSTANTS.JWT_EXPIRATION, // expires in 12 hours
        });
        res.json({
          success: true,
          message: 'User Authenticated',
          token,
        });
      }
    });
  } catch (e) {
    console.log(e);
  }
};

export default {
  login,
};
