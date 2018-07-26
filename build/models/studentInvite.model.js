'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const studentInviteSchema = new _mongoose2.default.Schema({
  email: { type: String, required: true },
  batchId: { type: String },
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

const StudentInvite = _mongoose2.default.model('StudentInvite', studentInviteSchema);

exports.default = StudentInvite;