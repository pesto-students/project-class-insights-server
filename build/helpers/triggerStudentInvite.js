'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _studentInvite = require('../models/studentInvite.model');

var _studentInvite2 = _interopRequireDefault(_studentInvite);

var _sendMail = require('../helpers/sendMail');

var _sendMail2 = _interopRequireDefault(_sendMail);

var _constants = require('../lib/constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint no-underscore-dangle: 0 */
const triggerStudentInvite = async savedStudent => {
  const { email, batchId } = savedStudent;

  const payload = {
    email,
    batchId
  };

  const token = _jsonwebtoken2.default.sign(payload, _constants2.default.JWT_ENCRYPTION, {});

  const newInvite = new _studentInvite2.default({
    email,
    batchId,
    token
  });

  await newInvite.save();

  _sendMail2.default.sendInviteMail(email, token);
};

exports.default = triggerStudentInvite;