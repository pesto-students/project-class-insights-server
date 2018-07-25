'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const emailVerifySchema = new _mongoose2.default.Schema({
  _userId: { type: _mongoose2.default.Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 43200
  }
});

const EmailVerify = _mongoose2.default.model('EmailVerify', emailVerifySchema);

exports.default = EmailVerify;