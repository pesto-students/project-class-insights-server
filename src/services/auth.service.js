import jwt from 'jsonwebtoken';
import CONSTANTS from '../lib/constants';

const ensureAuthenticated = (req, res, next) => {
  // get token from request
  let token;
  const bearerHeader = req.headers.authorization;
  if (bearerHeader) {
    const bearer = bearerHeader.split(' ')[1];
    token = bearer;
  }
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
        error: false,
        message: 'No token provided.',
      });
  }
};

export default {
  ensureAuthenticated,
};
