'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _feedbackform = require('../models/feedbackform.model');

var _feedbackform2 = _interopRequireDefault(_feedbackform);

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _batches = require('../models/batches.model');

var _batches2 = _interopRequireDefault(_batches);

var _analyseFeedbacks = require('../helpers/analyseFeedbacks');

var _analyseFeedbacks2 = _interopRequireDefault(_analyseFeedbacks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const submit = async (req, res) => {
  const { batchId, date } = req.body;
  const { email } = req.decoded;
  let userId;
  let batchIdRef;
  try {
    const getUserId = await _user2.default.findOne({ email }, { _id: 1 });
    const batchReferenceId = await _batches2.default.findOne({ batchId }, { _id: 1 });
    userId = getUserId;
    batchIdRef = batchReferenceId;
  } catch (error) {
    console.error('error at creating form');
    res.json({ error: 'batch does not exist' });
  }

  const newForm = new _feedbackform2.default({
    subject: req.body.subject,
    topic: req.body.topic,
    creationDate: new Date(date),
    batchId: batchIdRef,
    userId,
    subtopics: req.body.subtopics.reduce((acc, curr) => {
      return [...acc, { subtopicName: curr.subtopicName }];
    }, [])
  });
  try {
    await newForm.save();
    _analyseFeedbacks2.default.setInitialResults();
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