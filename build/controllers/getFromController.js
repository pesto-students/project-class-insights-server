'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _feedbackform = require('../models/feedbackform.model');

var _feedbackform2 = _interopRequireDefault(_feedbackform);

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _students = require('../models/students.model');

var _students2 = _interopRequireDefault(_students);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getLatestForm = async (req, res) => {
  await _feedbackform2.default.findOne({}, {}, { sort: { date: -1 } }, (err, form) => {
    res.json(form);
  });
};

const getFormById = async (req, res) => {
  await _feedbackform2.default.findById(req.params.id, (err, form) => {
    res.json(form);
  });
};

const getForm = async (req, res) => {
  const sort = Number(req.query.sort) || -1;

  const { email } = req.decoded;

  const userData = await _user2.default.findOne({ email }, { isInstructor: 1, _id: 1 });
  const { isInstructor, _id } = userData;
  if (isInstructor) {
    const query = _feedbackform2.default.find({ userId: _id }, {}, { sort: { date: sort } }).populate('batchId');
    await query.exec((err, form) => {
      if (err) {
        res.json({ error: err.message });
      }
      res.json(form);
    });
  } else {
    const studentObjectId = _id;
    // array error so iterate
    console.log('asd', studentObjectId);
    const studentData = await _students2.default.find({ studentObjectId: _id }, { batchId: 1 });
    const { batchId } = studentData[0];
    console.log(batchId);
    const form = await studentData.reduce(async (promise, ele) => {
      const acc = await promise;
      try {
        const results = await _feedbackform2.default.find({ batchId: ele.batchId }, {}, { sort: { date: sort } }).populate('batchId');
        return [...acc, ...results];
      } catch (error) {
        console.log(error.message);
        return acc;
      }
    }, Promise.resolve([]));
    console.log(form);
    res.json(form);
    // const query = FeedbackformModel.find({ batchId }, {}, { sort: { date: sort } });
    // await query.exec((err, form) => {
    //   if (err) {
    //     res.json({ error: err.message });
    //   }
    //   res.json(form);
    // });
    // // set is submitted to true if it's in the student model submitted forms
  }
};

exports.default = {
  getLatestForm,
  getFormById,
  getForm
};