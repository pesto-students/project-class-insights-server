'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _instructor = require('../models/instructor.model');

var _instructor2 = _interopRequireDefault(_instructor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const verifyInstructor = async emailPassed => {
  const email = emailPassed;
  const user = await _user2.default.findOne({ email }, {});
  // eslint-disable-next-line no-underscore-dangle
  const instructor = await _instructor2.default.findOne({ loginId: user._id }, {});
  if (instructor) {
    return instructor;
  }
  return false;
};

exports.default = {
  verifyInstructor
};