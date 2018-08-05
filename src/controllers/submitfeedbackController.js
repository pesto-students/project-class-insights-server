import mongoose from 'mongoose';
/* eslint no-underscore-dangle: 0 */
import FeedbackSubmissionModel from '../models/feedbackSubmission.model';
import analyseFeedbacks from '../helpers/analyseFeedbacks';
import FeedbackFormModel from '../models/feedbackform.model';


const submitfeedback = async (req, res) => {
  const { batchId } = req.body;
  const { email } = req.decoded;
  const refFeedbackObjectId = mongoose.Types.ObjectId(req.body._id);
  try {
    const submittedFeedback = await FeedbackSubmissionModel.findOne({
      email,
      feedbackForm_ID: req.body._id,
    }, {});
    if (submittedFeedback) {
      res.json({ error: 'Already Submitted' });
    } else {
      const { _id } = req.body;
      const formData = await FeedbackFormModel.findById(_id, {});
      const { isActive } = formData;
      const newFeedback = new FeedbackSubmissionModel({
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
            rating: curr.rating,
          },
          ];
        }, []),
        comments: req.body.comments,
      });
      await newFeedback.save();
      analyseFeedbacks.analyseFeedbacks();
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

export default { submitfeedback };
