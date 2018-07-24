import FeedbackSubmissionModel from '../models/feedbackSubmission.model';

const getBatchesFeedback = async (req, res) => {
  const limit = Number(req.query.limit) || 5;
  const desc = -1;
  console.log(req.query);
  const query = FeedbackSubmissionModel.find({}, { date: '' }, { sort: { date: desc } })
    .limit(Number(limit));
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
  const query = FeedbackSubmissionModel.find({ creationDate: date }, { }, { date: { sort: desc } })
    .limit(Number(limit));
  await query.exec((err, submittedFeedbackForm) => {
    if (err) {
      res.json({ error: err.message });
    }
    res.json(submittedFeedbackForm);
  });
};

export default {
  getBatchesFeedback,
  getDayBatchFeedback,
};
