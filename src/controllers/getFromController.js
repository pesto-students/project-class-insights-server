import FeedbackformModel from '../models/feedbackform.model';
import UserSchema from '../models/user.model';
import StudentModel from '../models/students.model';

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
  const sort = Number(req.query.sort) || -1;

  const { email } = req.decoded;

  const userData = await UserSchema.findOne({ email }, { isInstructor: 1, _id: 1 });
  const { isInstructor, _id } = userData;
  if (isInstructor) {
    const query = FeedbackformModel.find({ userId: _id }, {}, { sort: { date: sort } }).populate('batchId');
    await query.exec((err, form) => {
      if (err) {
        res.json({ error: err.message });
      }
      res.json(form);
    });
  } else {
    const studentObjectId = _id;
    // array error so iterate
    const studentData = await StudentModel.find({ studentObjectId }, { batchId: 1 });
    const { batchId } = studentData[0];
    const form = await batchId.reduce(async (promise, ele) => {
      const acc = await promise;
      try {
        const results = await FeedbackformModel
          .find({ batchId: ele }, {}, { sort: { date: sort } })
          .populate('batchId');
        return [...acc, ...results];
      } catch (error) {
        return acc;
      }
    }, Promise.resolve([]));
    res.json(form);
  }
};

export default {
  getLatestForm,
  getFormById,
  getForm,
};
