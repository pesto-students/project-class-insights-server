'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UserBatchSchema = _mongoose2.default.Schema({
  email: {
    type: String,
    required: true
  },
  batchId: String
});

const UserBatchModel = _mongoose2.default.model('userBatchModel', UserBatchSchema);

exports.default = UserBatchModel;