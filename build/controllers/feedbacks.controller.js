'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _feedbackSubmission = require('../models/feedbackSubmission.model');

var _feedbackSubmission2 = _interopRequireDefault(_feedbackSubmission);

var _verifyInstructor = require('../helpers/verifyInstructor');

var _verifyInstructor2 = _interopRequireDefault(_verifyInstructor);

var _feedbackform = require('../models/feedbackform.model');

var _feedbackform2 = _interopRequireDefault(_feedbackform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// For Instructor

const getBatchesFeedback = async (req, res) => {
  const limit = Number(req.query.limit) || 5;
  const desc = -1;
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

//  make the feedback inactive by setting a flag
// and making sure it doesn't appears in the student dashboard as well as the instructors.
const setStatusOfFeedback = async (req, res) => {
  const { email } = req.decoded;
  const { formId } = req.body;
  const { isActive } = req.body;
  // set active = true to get active results or set as inactive to get all the results
  const validInstructor = await _verifyInstructor2.default.verifyInstructor(email);
  if (validInstructor) {
    const instructorEmail = validInstructor.email;
    try {
      await _feedbackform2.default.findOneAndUpdate({
        email: instructorEmail,
        _id: formId
      }, { isActive });
      res.json({ success: 'Updated form status' });
    } catch (error) {
      res.json({ error: 'Error at deactivating form' });
    }
  }
};

// For Students

exports.default = {
  getBatchesFeedback,
  getDayBatchFeedback,
  setStatusOfFeedback
};