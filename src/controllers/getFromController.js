import FeedbackformModel from '../models/feedbackform.model';

const getLatestForm = async (req, res) => {
  await FeedbackformModel.findOne({}, {}, { sort: { date: -1 } }, (err, form) => {
    res.json(form);
  });
};

const getFormById = async (req, res) => {
  await FeedbackformModel.findById(req.params.id, (err, form) => {
    res.json(form);
  });
};

const getForm = async (req, res) => {
  const limit = Number(req.query.limit) || 5;
  let sort = Number(req.query.sort) || -1;
  if (sort < -1 || sort > 1) {
    sort = -1;
  }
  const query = FeedbackformModel.find({}, {}, { sort: { date: sort } })
    .limit(Number(limit));
  await query.exec((err, form) => {
    if (err) {
      res.json({ error: err.message });
    }
    res.json(form);
  });
};

export default {
  getLatestForm,
  getFormById,
  getForm,
};
