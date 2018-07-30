'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { Schema } = _mongoose2.default;

const subtopic = _mongoose2.default.Schema({
  subtopicName: String,
  rating: [Number]
});

const feedbackFormSchema = _mongoose2.default.Schema({
  date: { type: Date, default: Date.now },
  subject: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  subtopics: [subtopic],
  creationDate: {
    type: Date
  },
  batchId: {
    type: Schema.Types.ObjectId,
    ref: 'userBatchModel',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const FeedbackFormModel = _mongoose2.default.model('feedbackFormModel', feedbackFormSchema);

exports.default = FeedbackFormModel;