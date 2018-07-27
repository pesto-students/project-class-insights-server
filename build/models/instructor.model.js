'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { Schema } = _mongoose2.default;

const Instructor = _mongoose2.default.Schema({
  name: {
    type: String,
    required: true
  },
  loginId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  batches: {
    type: [Schema.Types.ObjectId],
    ref: 'userBatchModel'
  }
});

const InstructorModel = _mongoose2.default.model('instructorsModel', Instructor);

exports.default = InstructorModel;