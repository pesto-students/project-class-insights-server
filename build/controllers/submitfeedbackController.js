'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _feedbackSubmission = require('../models/feedbackSubmission.model');

var _feedbackSubmission2 = _interopRequireDefault(_feedbackSubmission);

var _analyseFeedbacks = require('../helpers/analyseFeedbacks');

var _analyseFeedbacks2 = _interopRequireDefault(_analyseFeedbacks);

var _feedbackform = require('../models/feedbackform.model');

var _feedbackform2 = _interopRequireDefault(_feedbackform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const submitfeedback = async (req, res) => {
  const { batchId } = req.body;
  const { email } = req.decoded;
  const refFeedbackObjectId = _mongoose2.default.Types.ObjectId(req.body._id);
  try {
    const submittedFeedback = await _feedbackSubmission2.default.findOne({
      email,
      feedbackForm_ID: req.body._id
    }, {});
    if (submittedFeedback) {
      res.json({ error: 'Already Submitted' });
    } else {
      const { _id } = req.body;
      const formData = await _feedbackform2.default.findById(_id, {});
      const { isActive } = formData;
      const newFeedback = new _feedbackSubmission2.default({
        feedbackForm_ID: refFeedbackObjectId,
        subject: req.body.subject,
        creationDate: req.body.creationDate,
        topic: req.body.topic,
        email,
        batchId,
        isActive,
        revisit: req.body.revisit,
        subtopics: req.body.subtopics.reduce((acc, curr) => {
          return [...acc, {
            subtopicName: curr.subtopicName,
            rating: curr.rating
          }];
        }, []),
        comments: req.body.comments
      });
      await newFeedback.save();
      _analyseFeedbacks2.default.analyseFeedbacks();
      console.log('feedback submitted');
      res.json({ success: 'feedback submitted successfully' });
    }
  } catch (error) {
    if (error.message.includes('subject: Path `subject` is required.')) {
      res.status(422);
      res.json({ error: 'subject field is required' });
    }
    if (error.message.includes('topic: Path `topic` is required')) {
      res.status(422);
      res.json({ error: 'Topic field is required' });
    }
    if (error.message.includes('feedbackForm_ID: Path `feedbackForm_ID` is required')) {
      res.status(422);
      res.json({ error: 'feedbackForm_ID is required' });
    } else {
      res.json({ error: 'error at submitting feedback' });
    }
  }
};
/* eslint no-underscore-dangle: 0 */
exports.default = { submitfeedback };