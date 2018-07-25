'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _feedbackSubmission = require('../models/feedbackSubmission.model');

var _feedbackSubmission2 = _interopRequireDefault(_feedbackSubmission);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const submitfeedback = async (req, res) => {
  const newFeedback = new _feedbackSubmission2.default({
    feedbackForm_ID: req.body._id,
    subject: req.body.subject,
    creationDate: req.body.creationDate,
    topic: req.body.topic,
    email: req.body.email,
    batchId: req.body.batchId,
    subtopics: req.body.subtopics.reduce((acc, curr) => {
      return [...acc, {
        subtopicName: curr.subtopicName,
        rating: curr.rating
      }];
    }, []),
    comments: req.body.comments
  });
  try {
    await newFeedback.save();
    console.log('feedback submitted');
    res.json({ success: 'feedback submitted successfully' });
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
    }
    console.log(error.message);
  }
}; /* eslint no-underscore-dangle: 0 */
exports.default = { submitfeedback };