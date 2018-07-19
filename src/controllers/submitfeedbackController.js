/* eslint no-underscore-dangle: 0 */
import FeedbackSubmissionModel from '../models/feedbackSubmission.model';

const submitfeedback = async (req, res) => {
  const newFeedback = new FeedbackSubmissionModel({
    feedbackForm_ID: req.body._id,
    subject: req.body.subject,
    creationDate: req.body.creationDate,
    topic: req.body.topic,
    email: req.body.email,
    batchId: req.body.batchId,
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
