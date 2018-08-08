/* eslint no-underscore-dangle: 0 */
import mongoose from 'mongoose';
import FeedbackformModel from '../models/feedbackform.model';
import FeedbackSubmissionModel from '../models/feedbackSubmission.model';
import FeedbackFormResultsModel from '../models/feedbackResults.model';

const getSubtopicAvg = (subtopics) => {
  const totalRatingOfaSubTopic = index => subtopics.reduce((acc, val) => {
    const subtopicRatingAtIndex = val.map(v2 => v2.rating)[index];
    return (acc + subtopicRatingAtIndex);
  }, 0);
  const subtopicAvg = subtopics[0].reduce((acc, curr, index) => {
    const singleSubtopicRating = ((totalRatingOfaSubTopic(index)) / subtopics.length) * 100;
    acc[curr.subtopicName] = Math.round(singleSubtopicRating) / 100;
    return acc;
  }, {});
  return subtopicAvg;
};

// calculates the results for each form submitted and consolidates them
const makeObject = async (singleForm) => {
  const responseObject = {};
  const id = mongoose.Types.ObjectId(singleForm._id);
  const findSubmittedFeedback = FeedbackSubmissionModel.find({ feedbackForm_ID: id }, {});
  try {
    const feedbacks = await findSubmittedFeedback.exec();
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
  } catch (error) {
    console.log('error at poll in makeObject');
  }
  return responseObject;
};

const analyseFeedbacks = async () => {
  const date = new Date();
  let allFeedbackForms = [];
  date.setDate(date.getDate() - 1);

  // get all the forms created by all the instructors as a list of their ids
  const query = FeedbackformModel.find({}).select('_id');
  try {
    allFeedbackForms = await query.exec();
  } catch (error) {
    console.log('error at poll feedback form modal');
  }

  // create a list of all the results you want to save
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

  // insert all the results one by one in the results model
  result.forEach(async (element) => {
    const analysedResult = await FeedbackFormResultsModel
      .findOne({ feedbackForm_ID: element.feedbackForm_ID }, {});
    if (analysedResult) {
      await FeedbackFormResultsModel
        .findOneAndUpdate({ feedbackForm_ID: element.feedbackForm_ID }, element);
    } else {
      const newResult = new FeedbackFormResultsModel(element);
      await newResult.save();
    }
  });
};

const setInitialResults = async () => {
  const forms = await FeedbackformModel.find({}, {});
  forms.forEach(async (ele) => {
    const data = await FeedbackFormResultsModel.findOne({ feedbackForm_ID: ele._id }, {});
    if (!data) {
      const {
        subject, topic, batchId, creationDate, _id,
      } = ele;
      const intialResult = new FeedbackFormResultsModel({
        subject,
        topic,
        batchId,
        averageRatings: { 'Not Rated': 0 },
        feedbackCounts: 0,
        creationDate,
        comments: [],
        feedbackForm_ID: _id,
      });
      try {
        await intialResult.save();
      } catch (error) {
        console.log('error at the poll in setting intial results');
      }
    }
  });
};


export default {
  analyseFeedbacks,
  setInitialResults,
};
