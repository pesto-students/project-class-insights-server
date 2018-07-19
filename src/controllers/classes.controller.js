import FeedbackSubmissionModel from '../models/feedbackSubmission.model';

const getBatches = async (req, res) => {
  const limit = Number(req.query.limit) || 5;
  const asc = 1;
  const query = FeedbackSubmissionModel.find(
    { email: req.body.email },
    { batchId: '' },
    { sort: { batchId: asc } },
  )
    .limit(Number(limit));
  await query.exec((err, submittedFeedbackForm) => {
    if (err) {
      res.json({ error: err.message });
    }
    res.json({ submittedFeedbackForm });
  });
};

const getClassesFeedback = async (req, res) => {
  const limit = Number(req.query.limit) || 5;
  const desc = -1;
  const query = FeedbackSubmissionModel.find({}, { date: '' }, { sort: { date: desc } })
    .limit(Number(limit));
  await query.exec((err, submittedFeedbackForm) => {
    if (err) {
      res.json({ error: err.message });
    }
    res.json(submittedFeedbackForm);
  });
};

const getThisDayClassFeedback = async (req, res) => {
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
  getClassesFeedback,
  getThisDayClassFeedback,
  getBatches,
};
