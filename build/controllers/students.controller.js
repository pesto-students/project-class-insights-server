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

var _instructor = require('../models/instructor.model');

var _instructor2 = _interopRequireDefault(_instructor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createStudent = async (req, res) => {
  const {
    email, batchId
  } = req.body;
  const userData = await _user2.default.findOne({ email }, { _id: 0, isInstructor: 1 });
  const isInstructor = userData ? userData.isInstructor : false;

  if (email !== req.decoded.email && !isInstructor) {
    try {
      const realBatchId = await _batches2.default.findOne({ batchId }, { _id: 1 });
      const newStudent = new _students2.default({
        email,
        batchId: realBatchId.id
      });
      const userId = await _user2.default.findOne({ email }, { _id: 1 });
      const student = await _students2.default.findOne({ studentObjectId: userId }, {});
      if (student) {
        await _students2.default.findOneAndUpdate({ studentObjectId: userId }, {
          $addToSet: { batchId: realBatchId }
        });
        res.json({ success: 'Student created and added to the batchId' });
      } else {
        const alreadyPresentStudent = await _students2.default.findOne({
          email, batchId: realBatchId.id
        }, {});
        if (alreadyPresentStudent) {
          res.json({ error: 'Already added in this batch' });
        } else {
          const savedStudent = await newStudent.save();
          await (0, _triggerStudentInvite2.default)(savedStudent);
          res.json({ success: 'Student created and added to the batchId' });
        }
      }

      _batchUpdater2.default.updateStudentCount();
      console.log('Student added to the batch');
    } catch (error) {
      res.json({ error: 'Error creating students' });
    }
  } else {
    res.json({ error: 'You can\'t add instructor as a student' });
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
  }
};

const deleteStudents = async (req, res) => {
  const { email } = req.decoded;
  const studentEmail = req.body.email;
  const { batchId } = req.body;
  const batches = batchId;
  try {
    const instructorId = await _instructor2.default.findOne({ batches }, { loginId: 1 });
    const emailBelongingForTheBatch = await _user2.default.findOne({ _id: instructorId.loginId }, { email: 1 });
    if (email === emailBelongingForTheBatch.email) {
      const studentObjectId = await _user2.default.findOne({ email: studentEmail }, { _id: 1 });

      if (studentObjectId === null) {
        // not registered in the user collection

        await _students2.default.findOneAndRemove({ email: studentEmail }, {});
      } else {
        // registered in the user collection
        const result = await _students2.default.findOneAndUpdate({ studentObjectId }, {
          $pull: {
            batchId: req.body.batchId
          }
        }, { new: true });
        // if the user is not in any more batches then delete the user from
        // the student table, user table as well
        if (result.batchId.length === 0) {
          await _students2.default.findOneAndRemove({ email: studentEmail }, {});
          await _user2.default.findOneAndRemove({ email: studentEmail }, {});
        }
      }
    }

    // update specific batch student count
    _batchUpdater2.default.updateSpecificStudentCount(batchId);
    res.json({ message: 'Student deleted' });
  } catch (error) {
    console.log('error in removing student');
    res.json({ error: 'Unable to delete student' });
  }
};

exports.default = {
  createStudent,
  passTheStudentId,
  getStudents,
  deleteStudents
};