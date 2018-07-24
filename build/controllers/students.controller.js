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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createStudent = async (req, res) => {
  const {
    name, batchId, studentObjectId
  } = req.body;
  const realBatchId = await _batches2.default.findOne({ batchId }, { _id: 1 });
  const newStudent = new _students2.default({
    name,
    batchId: realBatchId.id,
    studentObjectId
  });
  try {
    await newStudent.save();
    try {
      // error
      _batches2.default.findOneAndUpdate({ batchId }, { $inc: { studentCount: 1 } }, err => {
        if (err) res.json({ error: 'Error updating' });
        res.json({ success: 'Successfully updated' });
      });
    } catch (error) {
      res.json({ error: 'error at update' });
    }

    _batchUpdater2.default.updateStudentCount();
    console.log('Student added to the batch');
    res.json({ success: 'Student created and added to the batchId' });
  } catch (error) {
    res.json({ error: 'Error creating students' });
  }
};

exports.default = {
  createStudent
};