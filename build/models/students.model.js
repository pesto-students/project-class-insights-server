'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { Schema } = _mongoose2.default;

const StudentSchema = _mongoose2.default.Schema({
  batchId: {
    type: Schema.Types.ObjectId,
    ref: 'userBatchModel'
  },
  name: {
    type: String,
    default: ''
  },
  studentObjectId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: new _mongoose2.default.Types.ObjectId()
  },
  email: String
}, { strict: false });

const StudentModel = _mongoose2.default.model('studentsModel', StudentSchema);

exports.default = StudentModel;