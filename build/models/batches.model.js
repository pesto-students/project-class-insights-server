'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { Schema } = _mongoose2.default;

const UserBatchSchema = _mongoose2.default.Schema({
  instructorId: {
    type: Schema.Types.ObjectId,
    ref: 'instructorsModel',
    required: true
  },
  batchId: {
    type: String,
    required: true,
    unique: true
  },
  from: {
    type: Date,
    required: true
  },
  to: {
    type: Date,
    required: true
  },
  status: {
    type: Boolean,
    required: true
  }
});

const UserBatchModel = _mongoose2.default.model('userBatchModel', UserBatchSchema);

exports.default = UserBatchModel;