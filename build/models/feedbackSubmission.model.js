'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const subtopic = _mongoose2.default.Schema({
  subtopicName: String,
  rating: Number
});

const feedbackSubmissionSchema = _mongoose2.default.Schema({
  date: { type: Date, default: Date.now },
  feedbackForm_ID: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  creationDate: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  batchId: String,
  subtopics: [subtopic],
  comments: String
});

const FeedbackSubmissionModel = _mongoose2.default.model('feedbackSubmissionModel', feedbackSubmissionSchema);

exports.default = FeedbackSubmissionModel;