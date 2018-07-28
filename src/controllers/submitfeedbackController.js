import mongoose from 'mongoose';
/* eslint no-underscore-dangle: 0 */
import FeedbackSubmissionModel from '../models/feedbackSubmission.model';
import analyseFeedbacks from '../helpers/analyseFeedbacks';


const submitfeedback = async (req, res) => {
  const { batchId } = req.body;
  const { email } = req.decoded;
  const refFeedbackObjectId = mongoose.Types.ObjectId(req.body._id);
  const newFeedback = new FeedbackSubmissionModel({
    feedbackForm_ID: refFeedbackObjectId,
    subject: req.body.subject,
    creationDate: req.body.creationDate,
    topic: req.body.topic,
    email,
    batchId,
    subtopics: req.body.subtopics.reduce((acc, curr) => {
      return [...acc, {
        subtopicName: curr.subtopicName,
        rating: curr.rating,
      },
      ];
    }, []),
    comments: req.body.comments,
  });
  try {
    await newFeedback.save();
    analyseFeedbacks.analyseFeedbacks();
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
};

export default { submitfeedback };
