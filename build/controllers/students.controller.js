'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _students = require('../models/students.model');

var _students2 = _interopRequireDefault(_students);

var _batchUpdater = require('../helpers/batchUpdater');

var _batchUpdater2 = _interopRequireDefault(_batchUpdater);

var _batches = require('../models/batches.model');

var _batches2 = _interopRequireDefault(_batches);

var _triggerStudentInvite = require('../helpers/triggerStudentInvite');

var _triggerStudentInvite2 = _interopRequireDefault(_triggerStudentInvite);

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createStudent = async (req, res) => {
  const {
    email, batchId
  } = req.body;
  try {
    const realBatchId = await _batches2.default.findOne({ batchId }, { _id: 1 });
    const newStudent = new _students2.default({
      email,
      batchId: realBatchId.id
    });
    const userId = await _user2.default.findOne({ email }, { _id: 1 });
    const student = await _students2.default.findOne({ studentObjectId: userId }, {});
    if (student) {
      /* eslint-disable */
      await _students2.default.findOneAndUpdate({ studentObjectId: userId }, { $addToSet: { batchId: realBatchId } });
      await (0, _triggerStudentInvite2.default)(newStudent);
    } else {
      const savedStudent = await newStudent.save();
      await (0, _triggerStudentInvite2.default)(savedStudent);
    }

    _batchUpdater2.default.updateStudentCount();
    console.log('Student added to the batch');
    res.json({ success: 'Student created and added to the batchId' });
  } catch (error) {
    console.log(error);
    res.json({ error: 'Error creating students' });
  }
};

const passTheStudentId = async (namePassed, id, emailMatcher) => {
  const studentObjectId = id;
  const name = namePassed;
  const email = emailMatcher;
  try {
    await _students2.default.findOneAndUpdate({ email }, { name, studentObjectId });
    console.log('successfully updated the right student reference');
  } catch (error) {
    console.log('error at passing the right student reference');
  }
};

const getStudents = async (req, res) => {
  const batchId = req.params.id;
  try {
    const students = await _students2.default.find({ batchId });
    res.json(students);
  } catch (error) {
    res.status(500);
    console.log(error.message);
  }
};

exports.default = {
  createStudent,
  passTheStudentId,
  getStudents
};