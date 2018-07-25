'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _feedbackform = require('../models/feedbackform.model');

var _feedbackform2 = _interopRequireDefault(_feedbackform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const submit = async (req, res) => {
  const newForm = new _feedbackform2.default({
    subject: req.body.subject,
    topic: req.body.topic,
    creationDate: req.body.creationDate,
    batchId: req.body.batchId,
    email: req.body.email,
    subtopics: req.body.subtopics.reduce((acc, curr) => {
      return [...acc, { subtopicName: curr.subtopicName }];
    }, [])
  });
  try {
    await newForm.save();
    console.log('form successfully saved');
    res.json({ success: 'Form saved successfully' });
  } catch (error) {
    if (error.message.includes('subject: Path `subject` is required.')) {
      res.status(422);
      res.json({ error: 'subject field is required' });
    }
    if (error.message.includes('topic: Path `topic` is required')) {
      res.status(422);
      res.json({ error: 'Topic field is required' });
    }
    console.log(error.message);
  }
};

exports.default = { submit };