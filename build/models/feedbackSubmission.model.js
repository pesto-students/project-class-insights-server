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

const { Schema } = _mongoose2.default;

const feedbackSubmissionSchema = _mongoose2.default.Schema({
  date: { type: Date, default: Date.now },
  feedbackForm_ID: {
    type: Schema.Types.ObjectId,
    ref: 'feedbackFormModel',
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
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  batchId: {
    type: Schema.Types.ObjectId,
    ref: 'userBatchModel'
  },
  subtopics: [subtopic],
  comments: String,
  revisit: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const FeedbackSubmissionModel = _mongoose2.default.model('feedbackSubmissionModel', feedbackSubmissionSchema);

exports.default = FeedbackSubmissionModel;