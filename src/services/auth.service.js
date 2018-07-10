import jwt from 'jsonwebtoken';
import CONSTANTS from '../lib/constants';

const ensureAuthenticated = (req, res, next) => {
  // get token from request
  const token =
    req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, CONSTANTS.JWT_ENCRYPTION, (err, decoded) => {
      if (err) {
        res.json({
          success: false,
          message: 'Failed to authenticate token.',
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token, return an error
    res
      .status(403)
      .send({
        success: false,
        message: 'No token provided.',
      });
  }
};

export default {
  ensureAuthenticated,
};
