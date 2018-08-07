'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _feedbackform = require('../models/feedbackform.model');

var _feedbackform2 = _interopRequireDefault(_feedbackform);

var _feedbackSubmission = require('../models/feedbackSubmission.model');

var _feedbackSubmission2 = _interopRequireDefault(_feedbackSubmission);

var _feedbackResults = require('../models/feedbackResults.model');

var _feedbackResults2 = _interopRequireDefault(_feedbackResults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint no-underscore-dangle: 0 */
const getSubtopicAvg = subtopics => {
  const totalRating = index => subtopics.reduce((acc, val) => {
    return acc + val.map(v2 => v2.rating)[index];
  }, 0);
  const subtopicAvg = subtopics[0].reduce((acc, curr, index) => {
    acc[curr.subtopicName] = Math.round(totalRating(index) / subtopics.length * 100) / 100;
    return acc;
  }, {});
  return subtopicAvg;
};

const makeObject = async singleForm => {
  const responseObject = {};
  const id = _mongoose2.default.Types.ObjectId(singleForm._id);
  // const id = singleForm._id;
  const query2 = _feedbackSubmission2.default.find({ feedbackForm_ID: id }, {});
  try {
    const feedbacks = await query2.exec();
    console.log(JSON.stringify(feedbacks));
    if (feedbacks.length === 0) {
      return responseObject;
    }
    responseObject.isActive = feedbacks[0].isActive;
    responseObject.subject = feedbacks[0].subject;
    responseObject.topic = feedbacks[0].topic;
    responseObject.batchId = feedbacks[0].batchId;
    responseObject.averageRatings = getSubtopicAvg(feedbacks.map(val => val.subtopics));
    responseObject.feedbackCounts = feedbacks.length;
    responseObject.creationDate = feedbacks[0].creationDate;
    responseObject.comments = feedbacks.map(val => val.comments);
    responseObject.feedbackForm_ID = feedbacks[0].feedbackForm_ID;
    responseObject.revisitCount = feedbacks.reduce((acc, ele) => {
      if (ele.revisit) {
        return acc + 1;
      }
      return acc;
    }, 0);
    return responseObject;
  } catch (error) {
    console.log('error at poll in makeObject');
  }
  return responseObject;
};

const analyseFeedbacks = async () => {
  const date = new Date();
  let allFeedbackForms = [];
  date.setDate(date.getDate() - 1);
  const query = _feedbackform2.default.find({}).select('_id');
  try {
    allFeedbackForms = await query.exec();
  } catch (error) {
    console.log('error at poll feedback form modal');
  }

  const result = await allFeedbackForms.reduce(async (promise, curr) => {
    const acc = await promise;
    try {
      const data = await makeObject(curr);
      acc.push(data);
      return acc;
    } catch (error) {
      console.log(error.message);
      return acc;
    }
  }, Promise.resolve([]));
  result.forEach(async element => {
    const newResult = new _feedbackResults2.default(element);
    const analysedResult = await _feedbackResults2.default.findOne({ feedbackForm_ID: element.feedbackForm_ID }, {});
    if (analysedResult) {
      await _feedbackResults2.default.findOneAndUpdate({ feedbackForm_ID: element.feedbackForm_ID }, element);
    } else {
      await newResult.save();
    }
  });
};

const setInitialResults = async () => {
  const forms = await _feedbackform2.default.find({}, {});
  forms.forEach(async ele => {
    const data = await _feedbackResults2.default.findOne({ feedbackForm_ID: ele._id }, {});
    if (!data) {
      console.log('heya');
      const intialResult = new _feedbackResults2.default({
        subject: ele.subject,
        topic: ele.topic,
        batchId: ele.batchId,
        averageRatings: { 'Not Rated': 0 },
        feedbackCounts: 0,
        creationDate: ele.creationDate,
        comments: [],
        feedbackForm_ID: ele._id
      });
      try {
        await intialResult.save();
      } catch (error) {
        console.log(error.message);
        console.log('error at the poll in setting intial results');
      }
    }
  });
  // console.log(forms);
};

exports.default = {
  analyseFeedbacks,
  setInitialResults
};