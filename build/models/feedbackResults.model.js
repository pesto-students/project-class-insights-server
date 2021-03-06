'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { Schema } = _mongoose2.default;

const feedbackFormResultsSchema = _mongoose2.default.Schema({
  subject: {
    type: String
  },
  topic: String,
  batchId: {
    type: Schema.Types.ObjectId,
    ref: 'userBatchModel'
  },
  averageRatings: Object,
  feedbackCounts: Number,
  creationDate: Date,
  comments: [String],
  feedbackForm_ID: {
    type: Schema.Types.ObjectId,
    ref: 'feedbackFormModel'
  },
  revisitCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const FeedbackFormResultsModel = _mongoose2.default.model('feedbackFormResultsModel', feedbackFormResultsSchema);

exports.default = FeedbackFormResultsModel;