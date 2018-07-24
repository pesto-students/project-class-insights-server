'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _feedbackSubmission = require('../models/feedbackSubmission.model');

var _feedbackSubmission2 = _interopRequireDefault(_feedbackSubmission);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getBatchesFeedback = async (req, res) => {
  const limit = Number(req.query.limit) || 5;
  const desc = -1;
  console.log(req.query);
  const query = _feedbackSubmission2.default.find({}, { date: '' }, { sort: { date: desc } }).limit(Number(limit));
  await query.exec((err, submittedFeedbackForm) => {
    if (err) {
      res.json({ error: err.message });
    }
    res.json(submittedFeedbackForm);
  });
};

const getDayBatchFeedback = async (req, res) => {
  const limit = Number(req.query.limit) || 5;
  const { date } = req.query;
  const desc = -1;
  const query = _feedbackSubmission2.default.find({ creationDate: date }, {}, { date: { sort: desc } }).limit(Number(limit));
  await query.exec((err, submittedFeedbackForm) => {
    if (err) {
      res.json({ error: err.message });
    }
    res.json(submittedFeedbackForm);
  });
};

exports.default = {
  getBatchesFeedback,
  getDayBatchFeedback
};